import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sistema Oncológico</h1>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-xl">¡Registro Exitoso!</CardTitle>
            <CardDescription>Tu cuenta ha sido creada correctamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">Verifica tu correo electrónico</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Hemos enviado un enlace de verificación a tu correo. Haz clic en el enlace para activar tu cuenta y
                    poder acceder al sistema.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Próximos pasos:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Revisa tu bandeja de entrada y spam</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Haz clic en el enlace de verificación</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Inicia sesión en el sistema</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/auth/login">Ir a Iniciar Sesión</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
