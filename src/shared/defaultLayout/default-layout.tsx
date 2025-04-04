import { ReactNode } from "react"
import "./default-layout.module.css"
import { Header } from "@widgets/header"
import { Footer } from "@widgets/footer"

type DefaultLayoutProps = {
    children: ReactNode
}

export function DefaultLayout({children}:DefaultLayoutProps) {
    return(
        <div className="container-default-layout">
            <Header/>
            <div className = 'container-main'>
                {children}
            </div>
            <Footer/>
        </div>
    )
}