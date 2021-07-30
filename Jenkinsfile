pipeline {
    agent 'any'

    environment {
        IMAGE='scan.wp-migration.com'
        TAG=sh(returnStdout:true, script: 'git describe').trim()
    }

    stages {
        stage ('Lint') {
            steps {
                sh 'docker build . -t $IMAGE:$TAG'
                sh 'docker run -d --name $IMAGE-$TAG $IMAGE:$TAG /bin/sh -c "trap : TERM INT; (while true; do sleep 1000; done) & wait"'
                sh 'docker exec $IMAGE-$TAG yarn || true'
                sh 'docker exec $IMAGE-$TAG ./node_modules/.bin/eslint "./src/**/*.{ts,tsx}" -f checkstyle -o checkstyle.xml || true'
                sh 'docker cp $IMAGE-$TAG:/src/checkstyle.xml checkstyle.xml'
            }
        }
    }
    post {
        always {
            recordIssues enabledForFailure: true, tool: checkStyle(pattern: 'checkstyle.xml')
            sh 'docker stop $IMAGE-$TAG || true'
            sh 'docker rm $IMAGE-$TAG || true'
            sh 'docker rmi $IMAGE:$TAG || true'
        }
    }
}
