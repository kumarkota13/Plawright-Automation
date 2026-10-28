pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'all'],
            description: 'Browser project to run'
        )

        choice(
            name: 'SUITE',
            choices: ['all', 'smoke'],
            description: 'Run everything or only @smoke tests'
        )
    }

    environment {
        CI = 'true'
    }

    stages {

        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Test') {
            steps {
                script {
                    def project = params.BROWSER == 'all' ? '' : "--project=${params.BROWSER}"
                    def grep = params.SUITE == 'smoke' ? '--grep @smoke' : ''

                    bat "npx playwright test ${project} ${grep}"
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'results/junit.xml'
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}