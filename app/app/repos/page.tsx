import { Suspense } from "react"
import { ReposPage } from "@/components/pages/repos-page"
import Loading from "./loading"

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ReposPage />
    </Suspense>
  )
}
