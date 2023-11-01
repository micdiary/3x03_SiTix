pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
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
                    --suppression "yarn.json"
                    -o './'
                    -s './'
                    -f 'ALL' 
                    --prettyPrint''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                    }
                    post {
		    success {
			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
		}
	}
                }
    }
}


