'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PinPage = () => {
    const router = useRouter()
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Pin not found</h1>
                <Button onClick={() => router.push('/')}>Go Home</Button>
            </div>
        </div>
    )
}
export default PinPage;