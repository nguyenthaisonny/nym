import Verify from "@/components/auth/verify";

const VerifyPage = ({params} : {params: { id: string }}) => {
    const {id} = params
    return (
        <Verify id={id ?? "1"}/>
    )
}

export default VerifyPage;