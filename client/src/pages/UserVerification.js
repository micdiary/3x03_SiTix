import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Divider, Typography } from 'antd'
import * as constants from '../constants'
import { verifyEmail } from '../api/account'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { buttonStyle, cardStyletwo } from './PagesStyles'
import { buttonBlack, buttonWhite } from '../components/Buttons'
import { showNotification } from '../components/Notification'

const UserVerfication = () => {
  let navigate = useNavigate()
  const location = useLocation()

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')
    
    verifyEmail({ token: token })
      .then(() => {
        setIsButtonDisabled(false)
        setIsTokenValid(true)
      })
      .catch((err) => {
        setIsTokenValid(false)
        showNotification(err.message)
      })
  }, [location.search])

  const loginButton = () => {
    navigate(constants.LOGIN_URL)
  }

  const registerButton = () => {
    navigate(constants.REGISTER_URL)
  }
  
  return isTokenValid ? (
    <div>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={20} sm={16} md={8} lg={8}>
          <Card style={cardStyletwo}>
            <Typography.Title level={2}>
              Verified <CheckCircleTwoTone twoToneColor="#52c41a" />
            </Typography.Title>
            <Divider />
            <p style={{ marginBottom: '30px' }}>
              <b>Your account has been verified.</b>
            </p>
            <Button
              style={buttonStyle}
              onClick={loginButton}
              disabled={isButtonDisabled}
              onMouseOut={buttonBlack}
              onMouseOver={buttonWhite}
            >
              Login
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  ) : (
    <div>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={20} sm={16} md={8} lg={8}>
          <Card style={cardStyletwo}>
            <Typography.Title level={2}>
              Account not verified <CheckCircleTwoTone twoToneColor="#52c41a" />
            </Typography.Title>
            <Divider />
            <p style={{ marginBottom: '30px' }}>
              <b>Please register your account again.</b>
            </p>
            <Button
              style={buttonStyle}
              onClick={registerButton}
              disabled={isButtonDisabled}
              onMouseOut={buttonBlack}
              onMouseOver={buttonWhite}
            >
              Register
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserVerfication
