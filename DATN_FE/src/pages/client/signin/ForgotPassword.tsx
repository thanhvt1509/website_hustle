import React from 'react'
import { ForgotAccountForm, ForgotAccountSchema } from '../../../Schemas/forgotAccount'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { message } from 'antd'

const ForgotPassword = () => {
    const { handleSubmit, register, formState: { errors } } = useForm<ForgotAccountForm>({
        resolver: yupResolver(ForgotAccountSchema)
    })
    const handleForgotAccount = async (data: ForgotAccountForm) => {
        await axios.post(
            "http://localhost:8080/api/auth/user/forgotPassword",
            data
        );
        message.success("Mã token đã gửi về email của bạn")
    }
    return (
        <div>
            <form onSubmit={handleSubmit(handleForgotAccount)} className="w-full formForgotPass hidden" action="">
                <input
                    type="text"
                    {...register("email")}
                    placeholder="Vui lòng nhập email của bạn ..."
                    className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 mb-[25px] focus:outline-none focus:bg-white "
                />
                <p className="text-red-500 italic text-sm">
                    {errors ? errors.email?.message : ""}
                </p>
                <div className="flex mt-[25px]">
                    <button className="bg-[#333333] hover:bg-black transition-all ease-linear px-[28px] w-[350px] py-[12px] text-[#ffffff] rounded-lg uppercase tracking-wide">
                        Gửi email
                    </button>
                    <div className="flex flex-col ml-[30px]">
                        <p>Quay lại?</p>
                        <p className="text-blue-400 italic ml-1 opacity-60 cursor-pointer hover:opacity-80 buttonSignin-3">
                            Đăng Nhập
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword
