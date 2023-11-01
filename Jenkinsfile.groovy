pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                script {
                    echo 'Installing dependencies...'
                    sh 'pwd'
                    sh 'id'
                    sh 'npm --version'
                    sh 'npm ci'
                    sh 'npm install'
                }
            }
        }
        stage('OWASP Dependency-Check Vulnerabilities') {
                    steps {
                        dependencyCheck additionalArguments: ''' 
                                    -o './'
                                    -s './'
                                    -f 'ALL' 
                                    --prettyPrint''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                        
                        dependencyCheckPublisher pattern: 'dependency-check-report.xml'
                    }
                }
        stage('Test') {
            steps {
                script {
                    echo 'Running tests...'
                    sh 'npm test'
                }
            }
        }
        
     
    }
}