import Header from '../../../layout/Header'
import Footer from '../../../layout/Footer'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { ResetPasswordForm, ResetPasswordSchema } from '../../../Schemas/ResetPassword'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { message } from 'antd'
const Resetpassword = () => {
    let params = new URLSearchParams(document.location.search)
    let token = params.get("token");
    const { handleSubmit, register, formState: { errors } } = useForm<ResetPasswordForm>({
        resolver: yupResolver(ResetPasswordSchema)
    })
    const navigate = useNavigate()
    const handleResetPassword = async (data: ResetPasswordForm) => {
        try {
            if (token) {
                await axios.post(
                    `http://localhost:8080/api/auth/reset-password/${token}`,
                    data
                );
                message.success("Đăng kí thành công!")
                navigate("/signin")
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Header></Header>
            <div className='w-[630px] py-[60px] mx-auto flex flex-col items-center mb-[55px]'>
                <h1 className='text-2xl text-center font-semibold my-3'>Quên mật khẩu</h1>
                <form onSubmit={handleSubmit(handleResetPassword)} className="w-full formResetPassword" action="">
                    <input
                        type="password"
                        {...register("newPassword")}
                        placeholder="Vui lòng nhập mật khẩu mới của bạn ..."
                        className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c]  italic tracking-wide px-4 py-4 mb-[25px] focus:outline-none focus:bg-white "
                    />
                    <p className="text-red-500 italic text-sm">
                        {errors ? errors.newPassword?.message : ""}
                    </p>
                    <input
                        type="password"
                        {...register("confirmNewPassword")}
                        placeholder="Vui lòng confirm mật khẩu mới của bạn ..."
                        className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 mb-[25px] focus:outline-none focus:bg-white "
                    />
                    <p className="text-red-500 italic text-sm">
                        {errors ? errors.confirmNewPassword?.message : ""}
                    </p>
                    <div className="flex mt-[25px]">
                        <button className="bg-[#333333] hover:bg-black transition-all ease-linear px-[28px] w-[350px] py-[12px] text-[#ffffff] rounded-lg uppercase tracking-wide ml-[50%]">
                            Đổi mật khẩu
                        </button>
                        <div className="flex flex-col ml-[30px]">
                            {/* <p className="text-blue-400 italic ml-1 opacity-60 cursor-pointer hover:opacity-80 buttonSignin-3">
                            Đổi mật khẩu
                        </p> */}
                        </div>
                    </div>
                </form>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Resetpassword
