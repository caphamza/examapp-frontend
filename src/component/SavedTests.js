import React, { useState, useEffect, useContext } from "react"
import './savedTest.css'
import { LoaderContext } from './context'
import { Container, Row, Col, Spinner, Modal, Button } from "react-bootstrap";
import {Link} from "react-router-dom";
import Files from 'react-files'
import Downloadpicture from '../images/cloud-computing.png'
import BackArrow from '../images/backArrow.png'
import axios from "axios";
import LocalStorage from 'local-storage'

// import { CgDatabase } from "react-icons/cg";
const modalValues = {
  values: [],
  index: 1
}

const correctArr = []
const gradeArr = []
const improvementFeedbackArr = []
const percentageArr = []
const totalArr = []

const SavedTests = () => {
  let userName = "ADI"
  const obj = {
    a: 1,
    b:2,
    c:3,
    d: 4
  }

  // const [loaderContext, setLoaderContext] = useContext(LoaderContext)
  const [file, setFile] = useState('')
  const [gradefile, setGradeFile] = useState('')
  const [data, setData] = useState('')
  const [feedback, setFeedback] = useState(false)
  const [feedbackData, setFeedbackData] = useState('')
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [reload, setReload] = useState(false)
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const user_name = LocalStorage.get('username')

  let renderTestDetails = () => {
    
    if (data.length === 0) {
      return (
        <div className="no_dataDiv">
          {/* <CgDatabase className="noDataIcon" /> */}
          <h4>No Data</h4>
        </div>
      );
    } else if (!feedback) {
      return data.map((test) => {
        return (
          <Row className="details_row" style={{ borderBottom: '1px solid #e6e6e6' }} > 
            <Col className="test_col">
              <h4 style={{ cursor: 'pointer' }} onClick={() => {
                getFeedback()
                setFeedback(true)    
              }}>{test.fields.test_name}</h4>
            </Col>
            <Col className="test_col">
              <h4>{test.fields.test_no}</h4>
            </Col>
          </Row>
        );
      });
    }
    else if (feedback && feedbackData) {
      let counter = 0 
      return (
        feedbackData.map( data => {
          const { Correct, Grade, Improvement_Feedback, Percentage, Total } = data
          correctArr.push(Correct)
          gradeArr.push(Grade)
          improvementFeedbackArr.push(Improvement_Feedback)
          percentageArr.push(Percentage)
          totalArr.push(Total)
          delete data.Correct
          delete data.Grade
          delete data.Improvement_Feedback
          delete data.Percentage
          delete data.Total
          const values = Object.keys(data).map(a => data[a])
          return (
            <Row className="details_row" onClick={() => {
              modalValues.index = counter
              setFeedback(true) }}> 
              <Col className="test_col"  >
                {console.log('Jaani values', data)}
                <h4 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                  modalValues['values'] = values
                  setModal(true)}}
                >
                  {data['Roll No']}
                </h4>
              </Col>
              <Col />
              {/* <Col className="test_col">
                <h4>{data.Q1_feedback}</h4>
              </Col> */}
            {/* <Col className="test_col">
              <h4>{test.grade_mark}</h4>
            </Col> */}
            </Row>
          )
          counter++
        })
      )
    }
  };

  const getFeedback = async () => {
    try {
      setLoading(true)
      console.log('lol')
      const config =  {headers : {
        "Content-Type": "multipart/form-data",
        }
      }
      const formData = new FormData()
      formData.append('pk', 1)
      const result = await axios.post('http://127.0.0.1:8000/showtest', formData, config)
      console.log('ASI', result.data)
      const arr = []
      Object.keys(result.data).map(v => arr.push(result.data[v]))
      console.log('AR', arr )
      setFeedbackData(arr)   
    }
    catch (e) {

    }  
    finally {
      setLoading(false)
    } 
 }

  

  useEffect(() => {
    getData()
  }, [feedbackData, ])

  useEffect(() => {
    // setLoaderContext(true)
      if (file){
        
      }
    
  }, [gradefile])

  const uploadFIle = async () => {
    const config =  {headers : {
      "Content-Type": "multipart/form-data",
      }
    }
    const formData = new FormData()
    formData.append('name', name)
    formData.append('no', number)
    formData.append('id', user_name)
    formData.append('test_file', file)
    formData.append('grades_file', gradefile)
    setLoading(true)
    axios.post('http://127.0.0.1:8000/addtest', formData, config ).then(res => {
      setReload(!reload)
      setLoading(false)
      getData()
    }).catch(err => {
      setLoading(false)
    })
  }

  const getData = async () => {
    try {
      setLoading(true)
      const config =  {headers : {
        "Content-Type": "multipart/form-data",
        }
      }
      const formData = new FormData()
      formData.append('id', user_name)
      const result = await axios.post('http://127.0.0.1:8000/showtestlist', formData, config)
      setData(JSON.parse(result.data.result))
    }
    catch (e) {

    }
    finally {
      setLoading(false)
    }
  }

  const handleClose = () => setModal(false)
   
  return(
    <>
    {
      loading ?

      <div style={{display: 'flex'}}>
        <div style={{marginLeft: '49%', marginTop: '20%', justifyContent: 'center', alignContent: 'center', }}>
          <Spinner animation="border" role="status" style={{ fontSize: 40}}>
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>  
      </div>
      :
      
      <div>
        <Modal show={modal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Result</Modal.Title>

          </Modal.Header>
          <Modal.Body>
            {              
              modalValues.values.map(data => {
                console.log('DAT DATA DTA', typeof(data))
                return (
                  <>
                    <h6 
                      className={ (typeof(data) == 'number' && data < 0.5) ? 'modal_dataW20_red' : typeof(data) == 'number' ? 'modal_dataW20'  : 'modal_dataW80' }
                    >
                      {typeof(data) == 'number' ? data.toFixed(2) : data}
                    </h6>
                  </>
                )
              })
            }
          </Modal.Body>
          <Modal.Footer className='mr-auto modal_footer'>
            <div>
              <p style={{marginBottom: '0.2rem'}}><span style={{fontWeight: 'bold'}}>Total Score: </span>{totalArr[modalValues.index]}</p>
              <p style={{marginBottom: '0.2rem'}}><span style={{fontWeight: 'bold'}}>Grade: </span>{gradeArr[modalValues.index]}</p>
              <p style={{marginBottom: '0.2rem'}}><span style={{fontWeight: 'bold'}}>Feedback: </span>{improvementFeedbackArr[modalValues.index]}</p>
            </div>
          </Modal.Footer>
        </Modal>
        <h1 style={{textAlign: 'center'}}>Welcome back! Here is a summary of your saved tests!</h1>
        <div className="test_details" style={{ borderRadius: 10 }}>
          <h2 className="title">
            { 
              feedbackData ? 
              <img 
                onClick={() => { 
                setFeedback(false)
                setFeedbackData(false)}} 
                style={{ width: '30px', height: '30px', marginRight: '5em' }} 
                src={ BackArrow } 
              /> : ''
            }
            ExamApp - Giving Accurate feedback for assesments
          </h2>
          <div className="details_wrapper">
            <h2 className="details_title">
              Welcome back {userName} heres a summary of your saved tests
            </h2>
            <Container fluid className="details_header" style={{ backgroundColor: '#001529', borderRadius: 10 }}>
              <Row>
                <Col className="header_title">
                  <h4 style={{color: '#fff'}}>{!feedbackData ? "Test Name" : "Student" }</h4>
                </Col>
                <Col className="header_title">
                  <h4 style={{color: '#fff'}}>{!feedbackData ? "Number" : ""}</h4>
                </Col>
                {/* <Col className="header_title">
                  <h4>Grade Mark</h4>
                </Col> */}
              </Row>
            </Container>
            <Container className="test_container" fluid>
              {renderTestDetails()}
            </Container>
            <Container className='upload_container' >
                <h6 style={{ color: '#a6a6a6', fontSize: '18px' }}>upload your files</h6>
                <img src={Downloadpicture} style={{ height: '40px', width: '40px'}} onClick={() => {uploadFIle()}}/>
                <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: '10px'  }} > 
                  <input 
                    className='input'
                    placeholder= 'name'
                    value = { name }
                    onChange={ v => setName(v.target.value) }
                  />
                  <input 
                    className='input'
                    placeholder= 'number'
                    value= { number }
                    onChange= { v => setNumber(v.target.value) }
                  />
                </div> 
                <div style={{display: 'flex', justifyContent: 'space-around',   }} > 
                <Files
                  className='files-dropzone'
                  onChange={ e => setFile(e[0])}
                  // onError={this.onFilesError}
                  accepts={['image/png', '.pdf', 'audio/*', '.zip', '.csv']}
                  multiple
                  maxFileSize={10000000}
                  minFileSize={0}
                  clickable
                >
                  <button className='btns'>Student answers</button>
                </Files>
                <Files
                  className='files-dropzone'
                  onChange={ e => setGradeFile(e[0])}
                  // onError={this.onFilesError}
                  accepts={['image/png', '.pdf', 'audio/*', '.zip', '.csv']}
                  multiple
                  maxFileSize={10000000}
                  minFileSize={0}
                  clickable
                >
                  <button className='btns'>Question Answers</button>
                </Files>     
                </div>
            </Container>
          </div>
            
          <h2 className="copyright">Copyright @2021</h2>
        </div>
      </div>
    }
    </>
  )
}
// }
export default SavedTests