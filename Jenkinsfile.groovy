pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
                sh 'cd 3x03_SiTix/client && npm install'
                sh 'cd 3x03_SiTix/server && npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
            post {
                always {
                    junit '**/junit.xml'
        }
        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--project 3x03_SiTix --scan 3x03_SiTix/client 3x03_SiTix/server --out 3x03_SiTix/dependency-check-reports'
            }
            post {
                always {
                    dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                }
            }
        }
    }
}