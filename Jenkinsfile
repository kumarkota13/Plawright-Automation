pipeline {
  agent any
  
  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  parameters {
    choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'all'], description: 'Browser project to run')
    choice(name: 'SUITE', choices: ['all', 'smoke'], description: 'Run everything or only @smoke tests')
  }

  environment {
    CI = 'true'
    HOME = "${WORKSPACE}"   // avoids npm cache permission issues in the container
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci || npm install'
      }
    }

    stage('Test') {
      steps {
        script {
          def project = params.BROWSER == 'all' ? '' : "--project=${params.BROWSER}"
          def grep    = params.SUITE == 'smoke' ? '--grep @smoke' : ''
          // setup project runs automatically as a dependency
          sh "npx playwright test ${project} ${grep}"
        }
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'results/junit.xml'
      publishHTML(target: [
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright Report',
        keepAll: true,
        allowMissing: true,
        alwaysLinkToLastBuild: true
      ])
      archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
    }
  }
}
