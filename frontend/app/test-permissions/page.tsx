import React from 'react'
import { useAuth } from '@/hooks/use-auth'
import { usePermissions } from '@/hooks/use-permissions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function TestPermissionsPage() {
  const { user, authenticated, loading: authLoading } = useAuth()
  const { permissions, canAccess, loading: permissionsLoading, refreshPermissions } = usePermissions()

  const loading = authLoading || permissionsLoading

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando información de permisos...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Test de Permisos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Autenticado:</strong> <Badge variant={authenticated ? "default" : "destructive"}>{authenticated ? "Sí" : "No"}</Badge></p>
          {user ? (
            <>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Nombre:</strong> {user.nombres} {user.apellidos}</p>
              <p><strong>Rol:</strong> <Badge>{user.rol}</Badge></p>
            </>
          ) : (
            <p className="text-red-500">No hay usuario autenticado.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Permisos de Módulos
            <Button onClick={refreshPermissions} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refrescar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Permisos recibidos:</strong></p>
            <div className="flex flex-wrap gap-2 mt-2">
              {permissions.length > 0 ? (
                permissions.map((p, index) => (
                  <Badge key={index} variant="secondary">{p}</Badge>
                ))
              ) : (
                <p className="text-muted-foreground">Ningún permiso asignado</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Verificación de Módulos:</h4>
              <div>Dashboard: <Badge variant={canAccess('dashboard') ? "default" : "destructive"}>{canAccess('dashboard') ? "Sí" : "No"}</Badge></div>
              <div>Pacientes: <Badge variant={canAccess('pacientes') ? "default" : "destructive"}>{canAccess('pacientes') ? "Sí" : "No"}</Badge></div>
              <div>Citas: <Badge variant={canAccess('citas') ? "default" : "destructive"}>{canAccess('citas') ? "Sí" : "No"}</Badge></div>
              <div>Consultas: <Badge variant={canAccess('consultas') ? "default" : "destructive"}>{canAccess('consultas') ? "Sí" : "No"}</Badge></div>
              <div>Laboratorio: <Badge variant={canAccess('laboratorio') ? "default" : "destructive"}>{canAccess('laboratorio') ? "Sí" : "No"}</Badge></div>
              <div>Administración: <Badge variant={canAccess('administracion') ? "default" : "destructive"}>{canAccess('administracion') ? "Sí" : "No"}</Badge></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Estado de autenticación:</strong> {authenticated ? "Autenticado" : "No autenticado"}</p>
            <p><strong>Cargando permisos:</strong> {permissionsLoading ? "Sí" : "No"}</p>
            <p><strong>Cantidad de permisos:</strong> {permissions.length}</p>
            <p><strong>Permisos raw:</strong> {JSON.stringify(permissions)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
