"use client"

import type { ReactElement } from "react"
import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Activity,
  Stethoscope,
  Save,
  ArrowLeft,
  Calendar,
  User,
  Heart,
  Thermometer,
  Scale,
  Ruler,
} from "lucide-react"
import Link from "next/link"

interface ConsultaForm {
  // Consulta básica
  fecha: string
  motivo_consulta: string
  diagnostico_provisional: string
  indicaciones: string
  observaciones: string

  // Historia clínica
  primer_sintoma: string
  fecha_primer_sintoma: string
  antecedentes_medicos: string
  antecedentes_quirurgicos: string
  sistema_cardiovascular: string
  sistema_genito_urinario: string
  sistema_gastro_intestinal: string
  menstruacion_menarquia: string
  menstruacion_tipo: string
  menstruacion_caracteres: string
  menstruacion_ultima: string
  menstruacion_gravida: string
  menstruacion_para: string
  menstruacion_abortos: string
  habitos_tabaco: string
  habitos_otros: string
  historia_familiar: string

  // Examen físico
  peso: string
  talla: string
  pulso: string
  respiracion: string
  presion_arterial: string
  temperatura: string
  estado_general: string

  // Examen por regiones
  cabeza_ojos: string
  cabeza_oidos: string
  cabeza_nariz: string
  cuello_dientes: string
  cuello_boca: string
  cuello_tiroides: string
  cuello_laringe: string
  cuello_ganglios: string
  torax_pulmones: string
  torax_corazon: string
  torax_senos: string
  abdomen_higado: string
  abdomen_genitales: string
  abdomen_bazo: string
  abdomen_recto: string
  extremidades: string
  diagrama_observaciones: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function NuevaConsultaPage({ params }: PageProps): ReactElement {
  const router = useRouter()
  const [pacienteId, setPacienteId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("consulta")
  const [paramsLoaded, setParamsLoaded] = useState(false)

  React.useEffect(() => {
    params
      .then((resolvedParams) => {
        setPacienteId(resolvedParams.id)
        setParamsLoaded(true)
      })
      .catch((error) => {
        console.error("Error resolving params:", error)
        setError("Error al cargar la página")
        setParamsLoaded(true)
      })
  }, [params])

  const [formData, setFormData] = useState<ConsultaForm>({
    fecha: new Date().toISOString().split("T")[0],
    motivo_consulta: "",
    diagnostico_provisional: "",
    indicaciones: "",
    observaciones: "",
    primer_sintoma: "",
    fecha_primer_sintoma: "",
    antecedentes_medicos: "",
    antecedentes_quirurgicos: "",
    sistema_cardiovascular: "",
    sistema_genito_urinario: "",
    sistema_gastro_intestinal: "",
    menstruacion_menarquia: "",
    menstruacion_tipo: "",
    menstruacion_caracteres: "",
    menstruacion_ultima: "",
    menstruacion_gravida: "",
    menstruacion_para: "",
    menstruacion_abortos: "",
    habitos_tabaco: "0",
    habitos_otros: "",
    historia_familiar: "",
    peso: "",
    talla: "",
    pulso: "",
    respiracion: "",
    presion_arterial: "",
    temperatura: "",
    estado_general: "",
    cabeza_ojos: "",
    cabeza_oidos: "",
    cabeza_nariz: "",
    cuello_dientes: "",
    cuello_boca: "",
    cuello_tiroides: "",
    cuello_laringe: "",
    cuello_ganglios: "",
    torax_pulmones: "",
    torax_corazon: "",
    torax_senos: "",
    abdomen_higado: "",
    abdomen_genitales: "",
    abdomen_bazo: "",
    abdomen_recto: "",
    extremidades: "",
    diagrama_observaciones: "",
  })

  const handleInputChange = (field: keyof ConsultaForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pacienteId) return

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuario no autenticado")
      }

      // Obtener perfil del médico
      const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

      if (!profile) {
        throw new Error("Perfil de médico no encontrado")
      }

      // Crear consulta clínica
      const { data: consulta, error: consultaError } = await supabase
        .from("consultas_clinicas")
        .insert({
          paciente_id: pacienteId,
          fecha: formData.fecha,
          motivo_consulta: formData.motivo_consulta,
          diagnostico_provisional: formData.diagnostico_provisional,
          indicaciones: formData.indicaciones,
          observaciones: formData.observaciones,
          medico_id: profile.id,
          user_id: user.id,
        })
        .select()
        .single()

      if (consultaError) throw consultaError

      // Crear historial médico
      // @ts-ignore - Supabase insert method returns error property
      const { error: historialError } = await supabase.from("historial_medico").insert({
        paciente_id: pacienteId,
        fecha: formData.fecha,
        primer_sintoma: formData.primer_sintoma,
        fecha_primer_sintoma: formData.fecha_primer_sintoma || null,
        antecedentes_medicos: formData.antecedentes_medicos,
        antecedentes_quirurgicos: formData.antecedentes_quirurgicos,
        sistema_cardiovascular: formData.sistema_cardiovascular,
        sistema_genito_urinario: formData.sistema_genito_urinario,
        sistema_gastro_intestinal: formData.sistema_gastro_intestinal,
        menstruacion_menarquia: formData.menstruacion_menarquia
          ? Number.parseInt(formData.menstruacion_menarquia)
          : null,
        menstruacion_tipo: formData.menstruacion_tipo,
        menstruacion_caracteres: formData.menstruacion_caracteres,
        menstruacion_ultima: formData.menstruacion_ultima || null,
        menstruacion_gravida: formData.menstruacion_gravida ? Number.parseInt(formData.menstruacion_gravida) : null,
        menstruacion_para: formData.menstruacion_para ? Number.parseInt(formData.menstruacion_para) : null,
        menstruacion_abortos: formData.menstruacion_abortos ? Number.parseInt(formData.menstruacion_abortos) : null,
        habitos_tabaco: Number.parseInt(formData.habitos_tabaco),
        habitos_otros: formData.habitos_otros,
        historia_familiar: formData.historia_familiar,
        user_id: user.id,
      })

      if (historialError) throw historialError

      // Crear examen físico
      const { data: examenFisico, error: examenError } = await supabase
        .from("examen_fisico")
        .insert({
          paciente_id: pacienteId,
          fecha: formData.fecha,
          peso: formData.peso ? Number.parseFloat(formData.peso) : null,
          talla: formData.talla ? Number.parseInt(formData.talla) : null,
          pulso: formData.pulso ? Number.parseInt(formData.pulso) : null,
          respiracion: formData.respiracion ? Number.parseInt(formData.respiracion) : null,
          presion_arterial: formData.presion_arterial,
          temperatura: formData.temperatura ? Number.parseFloat(formData.temperatura) : null,
          estado_general: formData.estado_general,
          user_id: user.id,
        })
        .select()
        .single()

      if (examenError) throw examenError

      // Crear examen por regiones
      // @ts-ignore - Supabase insert method returns error property
      const { error: regionesError } = await supabase.from("examen_regiones").insert({
        examen_fisico_id: examenFisico.id,
        cabeza_ojos: formData.cabeza_ojos,
        cabeza_oidos: formData.cabeza_oidos,
        cabeza_nariz: formData.cabeza_nariz,
        cuello_dientes: formData.cuello_dientes,
        cuello_boca: formData.cuello_boca,
        cuello_tiroides: formData.cuello_tiroides,
        cuello_laringe: formData.cuello_laringe,
        cuello_ganglios: formData.cuello_ganglios,
        torax_pulmones: formData.torax_pulmones,
        torax_corazon: formData.torax_corazon,
        torax_senos: formData.torax_senos,
        abdomen_higado: formData.abdomen_higado,
        abdomen_genitales: formData.abdomen_genitales,
        abdomen_bazo: formData.abdomen_bazo,
        abdomen_recto: formData.abdomen_recto,
        extremidades: formData.extremidades,
        diagrama_observaciones: formData.diagrama_observaciones,
      })

      if (regionesError) throw regionesError

      router.push(`/pacientes/${pacienteId}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al guardar la consulta")
    } finally {
      setIsLoading(false)
    }
  }

  if (!paramsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando consulta...</p>
        </div>
      </div>
    )
  }

  if (!pacienteId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error: ID de paciente no válido</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href={`/pacientes/${pacienteId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Paciente
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Nueva Consulta</h1>
                  <p className="text-sm text-muted-foreground">Registro completo de consulta médica</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="consulta" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Consulta</span>
              </TabsTrigger>
              <TabsTrigger value="historia" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Historia</span>
              </TabsTrigger>
              <TabsTrigger value="examen" className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4" />
                <span>Examen</span>
              </TabsTrigger>
              <TabsTrigger value="regiones" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Regiones</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Consulta General */}
            <TabsContent value="consulta" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Información de la Consulta</span>
                  </CardTitle>
                  <CardDescription>Datos generales de la consulta médica</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha de Consulta *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fecha"
                          type="date"
                          required
                          className="pl-10"
                          value={formData.fecha}
                          onChange={(e) => handleInputChange("fecha", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivo_consulta">Motivo de Consulta</Label>
                    <Textarea
                      id="motivo_consulta"
                      placeholder="Describe el motivo principal de la consulta..."
                      className="min-h-[100px]"
                      value={formData.motivo_consulta}
                      onChange={(e) => handleInputChange("motivo_consulta", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnostico_provisional">Diagnóstico Clínico Provisional</Label>
                    <Textarea
                      id="diagnostico_provisional"
                      placeholder="Diagnóstico provisional basado en la evaluación..."
                      className="min-h-[100px]"
                      value={formData.diagnostico_provisional}
                      onChange={(e) => handleInputChange("diagnostico_provisional", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="indicaciones">Indicaciones</Label>
                    <Textarea
                      id="indicaciones"
                      placeholder="Tratamiento, medicamentos, estudios recomendados..."
                      className="min-h-[100px]"
                      value={formData.indicaciones}
                      onChange={(e) => handleInputChange("indicaciones", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                    <Textarea
                      id="observaciones"
                      placeholder="Notas adicionales sobre la consulta..."
                      className="min-h-[80px]"
                      value={formData.observaciones}
                      onChange={(e) => handleInputChange("observaciones", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Historia Clínica */}
            <TabsContent value="historia" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Historia Clínica</span>
                  </CardTitle>
                  <CardDescription>Antecedentes médicos y quirúrgicos del paciente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primer Síntoma */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primer_sintoma">Primer Síntoma o Signo</Label>
                      <Textarea
                        id="primer_sintoma"
                        placeholder="Describe el primer síntoma..."
                        value={formData.primer_sintoma}
                        onChange={(e) => handleInputChange("primer_sintoma", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha_primer_sintoma">Fecha del Primer Síntoma</Label>
                      <Input
                        id="fecha_primer_sintoma"
                        type="date"
                        value={formData.fecha_primer_sintoma}
                        onChange={(e) => handleInputChange("fecha_primer_sintoma", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Antecedentes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="antecedentes_medicos">Antecedentes Médicos</Label>
                      <Textarea
                        id="antecedentes_medicos"
                        placeholder="Enfermedades previas, alergias, medicamentos..."
                        className="min-h-[100px]"
                        value={formData.antecedentes_medicos}
                        onChange={(e) => handleInputChange("antecedentes_medicos", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="antecedentes_quirurgicos">Antecedentes Quirúrgicos</Label>
                      <Textarea
                        id="antecedentes_quirurgicos"
                        placeholder="Cirugías previas, fechas, complicaciones..."
                        className="min-h-[100px]"
                        value={formData.antecedentes_quirurgicos}
                        onChange={(e) => handleInputChange("antecedentes_quirurgicos", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Sistemas */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Revisión por Sistemas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sistema_cardiovascular">Cardiovascular</Label>
                        <Textarea
                          id="sistema_cardiovascular"
                          placeholder="Síntomas cardiovasculares..."
                          value={formData.sistema_cardiovascular}
                          onChange={(e) => handleInputChange("sistema_cardiovascular", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sistema_genito_urinario">Génito Urinario</Label>
                        <Textarea
                          id="sistema_genito_urinario"
                          placeholder="Síntomas genitourinarios..."
                          value={formData.sistema_genito_urinario}
                          onChange={(e) => handleInputChange("sistema_genito_urinario", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sistema_gastro_intestinal">Gastro Intestinal</Label>
                        <Textarea
                          id="sistema_gastro_intestinal"
                          placeholder="Síntomas gastrointestinales..."
                          value={formData.sistema_gastro_intestinal}
                          onChange={(e) => handleInputChange("sistema_gastro_intestinal", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Menstruación (para pacientes femeninas) */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Historia Ginecológica</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="menstruacion_menarquia">Menarquia (años)</Label>
                        <Input
                          id="menstruacion_menarquia"
                          type="number"
                          placeholder="Edad"
                          value={formData.menstruacion_menarquia}
                          onChange={(e) => handleInputChange("menstruacion_menarquia", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="menstruacion_tipo">Tipo</Label>
                        <Input
                          id="menstruacion_tipo"
                          placeholder="Regular/Irregular"
                          value={formData.menstruacion_tipo}
                          onChange={(e) => handleInputChange("menstruacion_tipo", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="menstruacion_caracteres">Caracteres</Label>
                        <Input
                          id="menstruacion_caracteres"
                          placeholder="Abundante/Escasa"
                          value={formData.menstruacion_caracteres}
                          onChange={(e) => handleInputChange("menstruacion_caracteres", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="menstruacion_ultima">Última Menstruación</Label>
                        <Input
                          id="menstruacion_ultima"
                          type="date"
                          value={formData.menstruacion_ultima}
                          onChange={(e) => handleInputChange("menstruacion_ultima", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="menstruacion_gravida">Gesta</Label>
                        <Input
                          id="menstruacion_gravida"
                          type="number"
                          placeholder="Número"
                          value={formData.menstruacion_gravida}
                          onChange={(e) => handleInputChange("menstruacion_gravida", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="menstruacion_para">Para</Label>
                        <Input
                          id="menstruacion_para"
                          type="number"
                          placeholder="Número"
                          value={formData.menstruacion_para}
                          onChange={(e) => handleInputChange("menstruacion_para", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="menstruacion_abortos">Abortos</Label>
                        <Input
                          id="menstruacion_abortos"
                          type="number"
                          placeholder="Número"
                          value={formData.menstruacion_abortos}
                          onChange={(e) => handleInputChange("menstruacion_abortos", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hábitos */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Hábitos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="habitos_tabaco">Tabaco (cigarrillos/día)</Label>
                        <Select
                          value={formData.habitos_tabaco}
                          onValueChange={(value) => handleInputChange("habitos_tabaco", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No fuma</SelectItem>
                            <SelectItem value="1">1-5 cigarrillos</SelectItem>
                            <SelectItem value="2">6-10 cigarrillos</SelectItem>
                            <SelectItem value="3">11-20 cigarrillos</SelectItem>
                            <SelectItem value="4">Más de 20 cigarrillos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="habitos_otros">Otros Hábitos</Label>
                        <Textarea
                          id="habitos_otros"
                          placeholder="Alcohol, drogas, otros..."
                          value={formData.habitos_otros}
                          onChange={(e) => handleInputChange("habitos_otros", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Historia Familiar */}
                  <div className="space-y-2">
                    <Label htmlFor="historia_familiar">Historia Familiar</Label>
                    <Textarea
                      id="historia_familiar"
                      placeholder="Antecedentes familiares de cáncer u otras enfermedades relevantes..."
                      className="min-h-[100px]"
                      value={formData.historia_familiar}
                      onChange={(e) => handleInputChange("historia_familiar", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Examen Físico */}
            <TabsContent value="examen" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <span>Examen Físico</span>
                  </CardTitle>
                  <CardDescription>Signos vitales y estado general del paciente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Signos Vitales */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Signos Vitales</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="peso" className="flex items-center space-x-1">
                          <Scale className="h-4 w-4" />
                          <span>Peso (kg)</span>
                        </Label>
                        <Input
                          id="peso"
                          type="number"
                          step="0.1"
                          placeholder="70.5"
                          value={formData.peso}
                          onChange={(e) => handleInputChange("peso", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="talla" className="flex items-center space-x-1">
                          <Ruler className="h-4 w-4" />
                          <span>Talla (cm)</span>
                        </Label>
                        <Input
                          id="talla"
                          type="number"
                          placeholder="170"
                          value={formData.talla}
                          onChange={(e) => handleInputChange("talla", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pulso" className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>Pulso (lpm)</span>
                        </Label>
                        <Input
                          id="pulso"
                          type="number"
                          placeholder="80"
                          value={formData.pulso}
                          onChange={(e) => handleInputChange("pulso", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="respiracion">Respiración (rpm)</Label>
                        <Input
                          id="respiracion"
                          type="number"
                          placeholder="18"
                          value={formData.respiracion}
                          onChange={(e) => handleInputChange("respiracion", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presion_arterial">Presión Arterial</Label>
                        <Input
                          id="presion_arterial"
                          placeholder="120/80"
                          value={formData.presion_arterial}
                          onChange={(e) => handleInputChange("presion_arterial", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temperatura" className="flex items-center space-x-1">
                          <Thermometer className="h-4 w-4" />
                          <span>Temperatura (°C)</span>
                        </Label>
                        <Input
                          id="temperatura"
                          type="number"
                          step="0.1"
                          placeholder="36.5"
                          value={formData.temperatura}
                          onChange={(e) => handleInputChange("temperatura", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Estado General */}
                  <div className="space-y-2">
                    <Label htmlFor="estado_general">Estado General</Label>
                    <Textarea
                      id="estado_general"
                      placeholder="Describe el estado general del paciente: consciente, orientado, cooperador, etc."
                      className="min-h-[100px]"
                      value={formData.estado_general}
                      onChange={(e) => handleInputChange("estado_general", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Examen por Regiones */}
            <TabsContent value="regiones" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Examen por Regiones</span>
                  </CardTitle>
                  <CardDescription>Exploración física detallada por regiones anatómicas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cabeza */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">CABEZA</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cabeza_ojos">Ojos</Label>
                        <Textarea
                          id="cabeza_ojos"
                          placeholder="Exploración ocular..."
                          value={formData.cabeza_ojos}
                          onChange={(e) => handleInputChange("cabeza_ojos", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cabeza_oidos">Oídos</Label>
                        <Textarea
                          id="cabeza_oidos"
                          placeholder="Exploración auditiva..."
                          value={formData.cabeza_oidos}
                          onChange={(e) => handleInputChange("cabeza_oidos", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cabeza_nariz">Nariz</Label>
                        <Textarea
                          id="cabeza_nariz"
                          placeholder="Exploración nasal..."
                          value={formData.cabeza_nariz}
                          onChange={(e) => handleInputChange("cabeza_nariz", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cuello */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">CUELLO</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cuello_dientes">Dientes</Label>
                        <Textarea
                          id="cuello_dientes"
                          placeholder="Estado dental..."
                          value={formData.cuello_dientes}
                          onChange={(e) => handleInputChange("cuello_dientes", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cuello_boca">Boca</Label>
                        <Textarea
                          id="cuello_boca"
                          placeholder="Cavidad oral..."
                          value={formData.cuello_boca}
                          onChange={(e) => handleInputChange("cuello_boca", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cuello_tiroides">Tiroides</Label>
                        <Textarea
                          id="cuello_tiroides"
                          placeholder="Glándula tiroides..."
                          value={formData.cuello_tiroides}
                          onChange={(e) => handleInputChange("cuello_tiroides", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cuello_laringe">Laringe</Label>
                        <Textarea
                          id="cuello_laringe"
                          placeholder="Exploración laríngea..."
                          value={formData.cuello_laringe}
                          onChange={(e) => handleInputChange("cuello_laringe", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cuello_ganglios">Ganglios</Label>
                      <Textarea
                        id="cuello_ganglios"
                        placeholder="Adenopatías cervicales..."
                        value={formData.cuello_ganglios}
                        onChange={(e) => handleInputChange("cuello_ganglios", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Tórax */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">TÓRAX</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="torax_pulmones">Pulmones</Label>
                        <Textarea
                          id="torax_pulmones"
                          placeholder="Auscultación pulmonar..."
                          value={formData.torax_pulmones}
                          onChange={(e) => handleInputChange("torax_pulmones", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="torax_corazon">Corazón</Label>
                        <Textarea
                          id="torax_corazon"
                          placeholder="Auscultación cardíaca..."
                          value={formData.torax_corazon}
                          onChange={(e) => handleInputChange("torax_corazon", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="torax_senos">Senos</Label>
                        <Textarea
                          id="torax_senos"
                          placeholder="Exploración mamaria..."
                          value={formData.torax_senos}
                          onChange={(e) => handleInputChange("torax_senos", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Abdomen */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">ABDOMEN</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="abdomen_higado">Hígado</Label>
                        <Textarea
                          id="abdomen_higado"
                          placeholder="Palpación hepática..."
                          value={formData.abdomen_higado}
                          onChange={(e) => handleInputChange("abdomen_higado", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abdomen_genitales">Genitales</Label>
                        <Textarea
                          id="abdomen_genitales"
                          placeholder="Exploración genital..."
                          value={formData.abdomen_genitales}
                          onChange={(e) => handleInputChange("abdomen_genitales", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abdomen_bazo">Bazo</Label>
                        <Textarea
                          id="abdomen_bazo"
                          placeholder="Palpación esplénica..."
                          value={formData.abdomen_bazo}
                          onChange={(e) => handleInputChange("abdomen_bazo", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abdomen_recto">Recto</Label>
                        <Textarea
                          id="abdomen_recto"
                          placeholder="Exploración rectal..."
                          value={formData.abdomen_recto}
                          onChange={(e) => handleInputChange("abdomen_recto", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Extremidades */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">EXTREMIDADES</h4>
                    <div className="space-y-2">
                      <Textarea
                        id="extremidades"
                        placeholder="Exploración de extremidades superiores e inferiores..."
                        className="min-h-[100px]"
                        value={formData.extremidades}
                        onChange={(e) => handleInputChange("extremidades", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Diagrama */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">DIAGRAMA Y OBSERVACIONES</h4>
                    <div className="space-y-2">
                      <Label htmlFor="diagrama_observaciones">Observaciones del Diagrama</Label>
                      <Textarea
                        id="diagrama_observaciones"
                        placeholder="Describe hallazgos relevantes que se pueden representar en un diagrama corporal..."
                        className="min-h-[120px]"
                        value={formData.diagrama_observaciones}
                        onChange={(e) => handleInputChange("diagrama_observaciones", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" asChild>
              <Link href={`/pacientes/${pacienteId}`}>Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Consulta
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
