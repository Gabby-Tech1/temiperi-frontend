# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh












import React from 'react'
import './sales.css'
import { asset } from '../../assets/assets'
import { useState } from 'react'
import {NavLink} from 'react-router-dom'


const Sales = async ({url}) => {
   const [date, setDate] = useState(new Date())
   const [data, setData] = useState({
      id: '',
      name: '',
      quantity: '',
      price_per_bottle: '',
      price_per_case: '',
      payment: '',
      status: '',
      description: '',
      company: '',
      order_date: '',
      delivery_date: ''
   })
  

   const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({...data, [name]:value}))
   }

   // try {
   //    const {formData} = await axios.get('/orders', data)
   //    console.log(formData)
   // } catch (error) {
   //    console.log(error)
   // }



  return (
    <div className='sales_container'>
      <img src={asset.logo} alt="" width={120}/>
      <div className="date">
         <p>{date.getDate()}</p>
         <p>{date.getMonth()}</p>
         <p>{date.getFullYear()}, </p>
         <p>{date.getHours()} :</p>
         <p>{date.getMinutes()}</p>
      </div>
      <div className="form_container">
         <h1>Submit Order</h1>
         <p>Please fill all inputs with neccessary information required. Thank You</p>
      <form>
         <div className='form_info'>
               <input type="text" onChange={onChangeHandler} value={data.name} name='name' placeholder='Name' required/>
               <input type="text" onChange={onChangeHandler} value={data.quantity} name='quantity' placeholder='Quantity' required/>
         </div>
         <div className='form_info'>
               <input type="text" onChange={onChangeHandler} value={data.price_per_case} name='price_per_case' placeholder='Price per case (gh)' required/>
               <input type="text" onChange={onChangeHandler} value={data.price_per_bottle} name='price_per_bottle' placeholder='Price per bottle (gh)' required/>
         </div>
         <input type="text" onChange={onChangeHandler} value={data.description} name='description' placeholder='Description' required/>
         <input type="text" onChange={onChangeHandler} value={data.company} name='company' placeholder='Company Name' required/>
         <input type="text" onChange={onChangeHandler} value={data.status} name='status' placeholder='Product Status' required/>
         <input type="text" onChange={onChangeHandler} value={data.payment} name='payment' placeholder='Payment(cash or e-payment)' required/>
         <input type="text" onChange={onChangeHandler} value={data.order_date} name='order_date' placeholder='Order Date' required/>
         <input type="text" onChange={onChangeHandler} value={data.delivery_date} name='delivery_date' placeholder='Delivery Date' required/>

      </form>
      <NavLink to={'/invoice'}>
         <button type='submit'>Submit</button>
      </NavLink>
      </div>
    </div>
  )
}

export default Sales















 // try {
   //    const {formData} = await axios.get('/orders', data)
   //    console.log(formData)
   // } catch (error) {
   //    console.log(error)
   // }

   // const onSubmitHandler = async (event) => {
   //    event.preventDefault();
   //    const formData = new FormData();
   //    formData.append('id', data.id)
   //    formData.append('name', data.name)
   //    formData.append('quantity', data.quantity)
   //    formData.append('price', data.price)
   //    formData.append('description', data.description)
   //    formData.append('order_date', data.order_date)
   //    formData.append('delivery_date', data.delivery_date)
   //    formData.append('status', data.status)
   //    formData.append('company', data.company)

   //     const response = await axios.get(`${url}/orders`);

   //    if(response.data.success){
   //       setData({
   //          id,
   //          name: '',
   //          quantity: '',
   //          price_per_bottle: '',
   //          price_per_case: '',
   //          payment: '',
   //          status: '',
   //          description: '',
   //          company: '',
   //          order_date: '',
   //          delivery_date: ''
   //       })
   //       console.log(response.data.message)
   //    } else {
   //       console.log(err)
   //    }
   // }











      //const url = 'http://localhost:4000'

//    const [data, setData] = useState([{
//       id: '',
//       name: '',
//       quantity: '',
//       price_per_bottle: '',
//       price_per_case: '',
//       payment: '',
//       status: '',
//       description: '',
//       company: '',
//       order_date: '',
//       delivery_date: ''
// }])