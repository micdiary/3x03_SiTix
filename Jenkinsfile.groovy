pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
                sh 'npm install --save-dev @testing-library/jest-dom'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}