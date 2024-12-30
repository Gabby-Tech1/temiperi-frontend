import React from 'react'
import './sales.css'
import { asset } from '../../assets/assets'
import { useState } from 'react'
import {NavLink} from 'react-router-dom'



const Sales = async () => {

   // const onChangeHandler = (event) => {
   //    const name = event.target.name;
   //    const value = event.target.value;
   //    setData(data => ({...data, [name]:value}))
   // }

   const date = new Date().getDate()
   const time = new Date().getHours()
   const minute = new Date().getMinutes()
   const month = new Date().getMonth()
   const year = new Date().getFullYear()

  return (
    <div className='sales_container'>
      <img src={asset.logo} alt="" width={120}/>
      <div className="date">
         <b>Date: {date}</b>
         <b> {month + 1}</b>
         <b> {year + ', '}</b>
         <b>Time: {time}</b>
         <b> {minute}</b>
      </div> 
      <div className="form_container">
         <h1>Submit Order</h1>
         <p>Please fill all inputs with necessary information required. Thank You</p>
      <form>
         
      </form>
      <NavLink to={'/invoice'}>
         <button type='submit'>Submit</button>
      </NavLink>
      </div>
    </div>
  )
}

export default Sales