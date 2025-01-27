import { auth } from '@/auth';
import MeteorShower from '@/backforunds/MeteorShower';

const AuthLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <MeteorShower />
            {children}
        </>
    )
}

export default AuthLayout