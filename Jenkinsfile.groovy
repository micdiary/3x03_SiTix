pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
                sh 'npm install --save @testing-library/jest-dom @testing-library/react'
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
        stage('OWASP Dependency-Check Vulnerabilities') {
            steps { 
                dependencyCheck additionalArguments: ''' 
                    -o './'
                    -s './'
                    -f 'ALL' 
                    --prettyPrint''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
                    }
                    post {
		    success {
			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
		}
	}
                }
    }
}


