pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'cd 3x03_SiTix/client && npm install'
                sh 'cd 3x03_SiTix/server && npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'cd 3x03_SiTix/client && npm test'
                sh 'cd 3x03_SiTix/server && npm test'
            }
            post {
                always {
                    junit '**/junit.xml'
        }
        stage('OWASP Dependency Check') {
            steps {
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
