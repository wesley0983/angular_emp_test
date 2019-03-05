
// different project should modify here !
def SERVICE_NAME="angle-hr-web"

// build parameter
def ANGLE_DOCKER_REGISTRY_URI="project.angle-tech.com.tw:8001"
def ALIYUN_DOCKER_REGISTRY_URI="project.benchmarkchina.com:8001"
def DOCKER_FILE_PATH="./docker/Dockerfile"

def SERVICE_VERSION=""
def WEB_APP_PATH="./dist"
def SERVICE_CONTAINER_NAME=""
def ANGLE_SERVICE_IMAGE_NAME=""
def ALIYUN_SERVICE_IMAGE_NAME=""
def BASE_HREF=""

// deploy sit parameter
def DOCKER_NETWORK="angle"
def DOCKER_WORK_SPACE="/home/docker-shared-folder"

def REGISTRY_URI="http://i1-registry-v1:8080/eureka/"


pipeline {
    agent any
    parameters {
        booleanParam(name: 'IS_IMAGE_RELEASE', defaultValue: false , description: '只在master主線上要發佈到 uat 或 prod 時才勾選 ,用在是否建立發佈用的docker image')
        string(name: 'RELEASE_MESSAGE', defaultValue: 'If IS_IMAGE_RELEASE is true ,please input release message for create git tag', description: '只有發佈時才需要給git打tag用的訊息')
        string(name: 'MAJOR_VERSION', defaultValue: '1', description: '主要版號')
        string(name: 'MINOR_VERSION', defaultValue: '0', description: '次要版號')
        string(name: 'PATCH_VERSION', defaultValue: '0', description: '修訂版號')
        choice(name: 'ENVIRONMENT', choices: 'sit\nuat\nprod', description: '選擇angular打包所使用的環境變數(sit/uat/prod); 選擇uat或prod時, 不會部署sit ; docker image的tag會增加後綴字, example : project.angle-tech.com.tw:8001/angle/angle-hr-web:1.0.0.uat . ')
    }

    stages {
        stage('Init build parameter') {
            steps {
                echo "[ INFO ] [ Init ] ========== initialize build parameter =========="
                script {
                    def branchNames = "${env.BRANCH_NAME}".contains("#") ? "${env.BRANCH_NAME}".split('#') : "${env.BRANCH_NAME}"


                    if (params.IS_IMAGE_RELEASE == true) {
                       if (env.BRANCH_NAME == 'master') {
                         SERVICE_VERSION= "${params.MAJOR_VERSION}"
                         BASE_HREF = "/"
                       } else {
                         echo 'Issue branch can not release ! '
                         sh 'exit 1'
                       }
                    } else {
                       if ( env.BRANCH_NAME == 'master'  ) {
                         SERVICE_VERSION= "${params.MAJOR_VERSION}"
                         BASE_HREF = "/api/v${params.MAJOR_VERSION}/${SERVICE_NAME}/"
                       } else {
                        SERVICE_VERSION = "${params.MAJOR_VERSION}-issue-" + branchNames[1]
                        BASE_HREF = "/api/v${params.MAJOR_VERSION}-issue-" + branchNames[1] + "/" + SERVICE_NAME + "/"
                       }
                    }

                    // if ( env.BRANCH_NAME != 'master' && params.IS_IMAGE_RELEASE == false ) {
                    //     SERVICE_VERSION = "${params.MAJOR_VERSION}-issue-" + branchNames[1]
                    //     BASE_HREF = "/api/v${params.MAJOR_VERSION}-issue-" + branchNames[1] + "/" + SERVICE_NAME + "/"
                    // } else if ( env.BRANCH_NAME != 'master' && params.IS_IMAGE_RELEASE == true ) {
                    //     echo 'Issue branch can not release ! '
                    //     sh 'exit 1'
                    //  } else if ( env.BRANCH_NAME == "master" ) {
                    //     SERVICE_VERSION= "${params.MAJOR_VERSION}"
                    //     BASE_HREF = "/api/v${params.MAJOR_VERSION}/${SERVICE_NAME}/"
                    // }

                    SERVICE_CONTAINER_NAME= "${SERVICE_NAME}-v${SERVICE_VERSION}"
                    ANGLE_SERVICE_IMAGE_NAME = "${ANGLE_DOCKER_REGISTRY_URI}/angle/${SERVICE_NAME}:${params.MAJOR_VERSION}.${params.MINOR_VERSION}.${params.PATCH_VERSION}.${params.ENVIRONMENT}"
                    ALIYUN_SERVICE_IMAGE_NAME = "${ALIYUN_DOCKER_REGISTRY_URI}/angle/${SERVICE_NAME}:${params.MAJOR_VERSION}.${params.MINOR_VERSION}.${params.PATCH_VERSION}.${params.ENVIRONMENT}"
                }

                echo "[ INFO ] [ Init ] SERVICE_VERSION is ${SERVICE_VERSION} "
                echo "[ INFO ] [ Init ] SERVICE_CONTAINER_NAME is ${SERVICE_CONTAINER_NAME} "
                echo "[ INFO ] [ Init ] ANGLE_SERVICE_IMAGE_NAME is ${ANGLE_SERVICE_IMAGE_NAME} "
                echo "[ INFO ] [ Init ] ALIYUN_SERVICE_IMAGE_NAME is ${ALIYUN_SERVICE_IMAGE_NAME} "
            }
        }


        stage('Build artifact') {
             agent {
                docker { image 'node:8.9.3-alpine' }
            }
            environment {
                NODE_OPTIONS = '--max-old-space-size=2048'
            }
            steps {
                script {
                    sh 'npm install'
                    sh "npx ng build --configuration=${params.ENVIRONMENT} --base-href=${BASE_HREF}"
                }
            }
        }

        stage('Build image') {
            agent any
            steps {
                script {
                    echo "[ INFO ] [ Build image ] start build docker image "
                    sh "docker logout ${ANGLE_DOCKER_REGISTRY_URI}"
                    sh "docker login -u admin -p benchmark123 ${ANGLE_DOCKER_REGISTRY_URI}"
                    sh "docker build -f ${DOCKER_FILE_PATH} --build-arg WEB_APP_PATH=${WEB_APP_PATH} \
                                        -t ${ANGLE_SERVICE_IMAGE_NAME} ."
                    sh "docker logout ${ANGLE_DOCKER_REGISTRY_URI}"
                 }


            }
        }
        stage('Publish image') {
            when {
                expression { return params.IS_IMAGE_RELEASE }
            }
            steps {
                echo '[ INFO ] [ Publish image ] Publish image'
                script {
                    sh "docker logout ${ANGLE_DOCKER_REGISTRY_URI}"
                    sh "docker logout ${ALIYUN_DOCKER_REGISTRY_URI}"
                    sh "docker login -u admin -p benchmark123 ${ANGLE_DOCKER_REGISTRY_URI}"
                    sh "docker push ${ANGLE_SERVICE_IMAGE_NAME}"

                    sh "docker logout ${ANGLE_DOCKER_REGISTRY_URI}"
                    sh "docker logout ${ALIYUN_DOCKER_REGISTRY_URI}"
                    sh "docker login -u admin -p benchmark123 ${ALIYUN_DOCKER_REGISTRY_URI}"
                    sh "docker tag ${ANGLE_SERVICE_IMAGE_NAME} ${ALIYUN_SERVICE_IMAGE_NAME}"
                    sh "docker push ${ALIYUN_SERVICE_IMAGE_NAME}"

                    // Create git tag after release image
                    try {
                       sh "git tag -d v${params.MAJOR_VERSION}.${params.MINOR_VERSION}.${params.PATCH_VERSION}"
                    } catch (error) {
                       echo "Can't delete local tag due to ${error}"
                    }
                    try {
                       sh "git push --delete origin v${params.MAJOR_VERSION}.${params.MINOR_VERSION}.${params.PATCH_VERSION}"
                    } catch (error) {
                       echo "Can't delete remote tag due to ${error}"
                    }
                    sh "git tag -a v${params.MAJOR_VERSION}.${params.MINOR_VERSION}.${params.PATCH_VERSION} -m '${RELEASE_MESSAGE}'"
                    sh "git push origin v${params.MAJOR_VERSION}.${params.MINOR_VERSION}.${params.PATCH_VERSION}"
                }
            }
        }

        stage('Deploy sit') {
            agent any
            when {
                expression { return params.ENVIRONMENT=='sit' }
            }
            steps {
                echo '[ INFO ] [ Deploy sit ] start deploy sit'
                script{

                    try {
                        sh "docker rm -f ${SERVICE_CONTAINER_NAME}"
                    } catch (err) {
                        echo '[ INFO ] [ Deploy sit ] container not exist ! '
                    }

                    sh "docker run -d \
                      --network=${DOCKER_NETWORK} \
                      -v /etc/localtime:/etc/localtime:ro -v ${DOCKER_WORK_SPACE}:/home \
                      --network-alias ${SERVICE_CONTAINER_NAME} --name=${SERVICE_CONTAINER_NAME} \
                      -e SERVICE_NAME=${SERVICE_CONTAINER_NAME}  \
                       -e REGISTRY_URI=${REGISTRY_URI} \
                      ${ANGLE_SERVICE_IMAGE_NAME} "
                }
            }
        }


    }
}
