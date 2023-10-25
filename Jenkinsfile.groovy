pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
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
            } 
        }
        stage('Check OWASP Dependency') {
            steps {
                echo 'Check OWASP'
                // Add your OWASP Dependency-Check configuration here if needed
                dependencyCheck additionalArguments: ''' 
                     -o './'
                     -s './'
                     -f 'ALL' 
                     --prettyPrint''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                dependencyCheckPublisher pattern: 'dependency-check-report.xml' 
            }
        }
    }
}