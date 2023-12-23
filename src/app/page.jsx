"use client"
import Image from 'next/image'
import Container from 'react-bootstrap/Container'
import styles from '@/style/login.module.css'
import { use, useContext, useEffect, useState } from 'react'
import axios from "axios"
import { ImCogs } from "react-icons/im";
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { Context } from '@/context/Context'
import { useRouter } from 'next/navigation'
import ModalsForgetPassword from '@/components/Modals/ModalsForgetPassword'
import Loading from '@/components/Loading/Loading'
export default function Home() {
  const [errLogin, setErrLogin] = useState("");
  const [show, setShow] = useState(false);
  const context = useContext(Context);
  const router = useRouter();
  const formik = useFormik(
    {
      initialValues: {
        username: "",
        password: "",
      },
      onSubmit: values => {
        console.log("value", values)
        axios.post("http://localhost:8081/login", values)
          .then(res => {
            if (res.data) {
              context.setAccount(res.data)
              console.log("account", res.data)
            }
            else {
              setErrLogin("Tên tài khoản hoặc mật khẩu không chính xác")
            }
          })
          .catch(err => {
            toast.error("Hệ thống đang xảy ra lỗi vui lòng quay lại sau.")
            console.log("Lỗi đăng nhập", err)
          })
      }
    }
  )

  useEffect(() => {
    axios.get("http://localhost:8081/schoolYear/max")
      .then(res => {
        context.setSchoolYearMax(res.data)
      })
      .catch(err => {
        toast.error("Hệ thống xảy ra lỗi")
        console.log("Lỗi lấy niên khóa max", err)
      })
  }, [])

  useEffect(() => {
    if (context.showLoading) {
      context.setShowLoading(false)
    }
  }, [context.account])

  useEffect(() => {
    if (context.account) {
      if (context.account.change) {
        context.setShowLoading(true);
        router.push("/User")
      }
      else {
        if (context.account.positionName === "Giảng viên") {
          context.setShowLoading(true);
          router.push("/Lecture")
        }
        else if (context.account.positionName === "Thư ký khoa") {
          context.setShowLoading(true);
          router.push("/FacultySecretary")
        }
        else if (context.account.positionName === "Trưởng bộ môn") {
          context.setShowLoading(true);
          router.push("/DepartmentHead")
        }
        else {
          context.setShowLoading(true);
          router.push("/Chair")
        }
      }
    }
  }, [context.account])

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img className={styles.imgBg} src="https://code.ptit.edu.vn/2020/images/bg_left.png" width={500} height={500} />
      </div>
      <form onSubmit={formik.handleSubmit} className={styles.center}>
        <div className={styles.login}>
          <Image src="/PTITLOGO.png" width={80} height={80} alt="Logo" className={styles.img} />
          <p style={{
            fontSize: "19.2px",
          }}>Đăng nhập</p>
          <span style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "20px"
          }}>PTITHCM</span>
          <div className={styles.inputGroup}>
            <label style={{
              fontSize: "12.88px",
              color: "5f5f5f"
            }}>Tên đăng nhập</label>
            <input type="text" className={styles.input} name='username' onChange={formik.handleChange} value={formik.values.username}
              onFocus={() => setErrLogin("")}
            />
          </div>
          <div className={styles.inputGroup}>
            <label style={{
              fontSize: "12.88px",
              color: "5f5f5f"
            }}>Mật khẩu</label>
            <input type="password" className={styles.input}
              name='password' onChange={formik.handleChange} value={formik.values.password} onFocus={(() => setErrLogin(""))}
            />
          </div>
          <span className={styles.err}>{errLogin}</span>
          <div className={styles.forget} onClick={() => setShow(true)}>
            <span>Quên mật khẩu?</span>
          </div>
          <button type='submit' className={styles.btnLogin}>Đăng nhập</button>
        </div>
      </form>
      <div className={styles.right}>
        <img className={styles.imgBg} src="https://code.ptit.edu.vn/2020/images/bg_right.png" alt="" />
      </div>
      <ModalsForgetPassword
        setShow={setShow}
        show={show}
      />
      <Loading />
    </div>
  )
}
