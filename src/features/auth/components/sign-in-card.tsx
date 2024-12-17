"use client"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useForm from "@/hooks/use-form"
import { client } from "@/lib/rpc"
import { Loader2Icon } from "lucide-react"
import { Link } from "next-view-transitions"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { loginSchema } from "../schemas"
import { toast } from "sonner"

export default function SignInCard() {
  return (
    <Card className="size-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
      </CardHeader>
      <div className="px-7 mb-2">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <SignInForm />
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="py-7 flex flex-col gap-y-4">
        <Button
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-4" />
          Login with Google
        </Button>
        <Button
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-2 size-4" />
          Login with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>Dont&apos;t have an account?</p>
        <Link href="/sign-up">
          <span className="text-blue-700">&nbsp;Sign Up</span>
        </Link>
      </CardContent>
    </Card>
  )
}

function SignInForm() {
  "use no memo"

  const form = useForm({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: ""
    }
  })
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = form.handleSubmit(values => {
    startTransition(async () => {
      const response = await client.api.auth.login.$post({ json: values })
      if (response.ok) {
        toast.success("Logged in")
        router.push("/")
      } else {
        toast.error(await response.text())
      }
    })
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter email address"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter password"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} size="lg" className="w-full">
          {isPending && <Loader2Icon className="animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  )
}
