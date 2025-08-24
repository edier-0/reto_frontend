"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Home, BarChart3, History, Settings, Eye, EyeOff } from "lucide-react"

// Types
type Screen = "login" | "dashboard" | "project-detail" | "reports" | "history" | "settings"
type ProjectStatus = "active" | "closed"

interface Project {
  id: string
  name: string
  client: string
  budget: number
  income: number
  expenses: number
  budgetUsed: number
  status: ProjectStatus
  image: string
}

interface Transaction {
  id: string
  projectId: string
  type: "income" | "expense"
  amount: number
  description: string
  date: string
}

export default function ArchiFinancePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income")
  const [showPassword, setShowPassword] = useState(false)

  // Sample data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Casa del Sol",
      client: "Elena Ramirez",
      budget: 160000,
      income: 120000,
      expenses: 80000,
      budgetUsed: 75,
      status: "active",
      image: "/modern-house-exterior.png",
    },
    {
      id: "2",
      name: "Oficinas Innova",
      client: "Tech Solutions Inc.",
      budget: 200000,
      income: 180000,
      expenses: 90000,
      budgetUsed: 90,
      status: "active",
      image: "/modern-office-building.png",
    },
    {
      id: "3",
      name: "Residencia Los Pinos",
      client: "Ricardo Vargas",
      budget: 120000,
      income: 60000,
      expenses: 40000,
      budgetUsed: 50,
      status: "active",
      image: "/modern-residential-house.png",
    },
  ])

  const [closedProjects] = useState<Project[]>([
    {
      id: "4",
      name: "Residencia Moderna",
      client: "Elena Ramirez",
      budget: 160000,
      income: 120000,
      expenses: 80000,
      budgetUsed: 100,
      status: "closed",
      image: "/completed-modern-residence.png",
    },
    {
      id: "5",
      name: "Remodelación de Oficina",
      client: "Tech Solutions Inc.",
      budget: 130000,
      income: 95000,
      expenses: 65000,
      budgetUsed: 100,
      status: "closed",
      image: "/office-renovation-in-progress.png",
    },
  ])

  // Navigation functions
  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen)
    setSelectedProject(null)
  }

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project)
    setCurrentScreen("project-detail")
  }

  const goBack = () => {
    if (currentScreen === "project-detail") {
      setCurrentScreen("dashboard")
      setSelectedProject(null)
    } else {
      setCurrentScreen("dashboard")
    }
  }

  const handleLogin = () => {
    setCurrentScreen("dashboard")
  }

  const createProject = (projectData: any) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name,
      client: projectData.client,
      budget: Number.parseFloat(projectData.budget),
      income: Number.parseFloat(projectData.initialPayment || "0"),
      expenses: 0,
      budgetUsed: 0,
      status: "active",
      image: projectData.image || "/modern-architecture-concept.png",
    }
    setProjects([...projects, newProject])
    setShowNewProjectModal(false)
  }

  const closeProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
    setCurrentScreen("dashboard")
    setSelectedProject(null)
  }

  // Render functions for each screen
  const renderLogin = () => (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-8">ArchiFinance</h1>
        </div>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button onClick={handleLogin} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Log In
          </Button>
        </div>
      </div>
    </div>
  )

  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-800 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">ArchiFinance</h1>
        <Button onClick={() => setShowNewProjectModal(true)} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Project Cards */}
      <div className="p-4 space-y-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="bg-slate-700 border-slate-600 p-4 cursor-pointer hover:bg-slate-600 transition-colors"
            onClick={() => openProjectDetail(project)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.name}
                className="w-16 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white">{project.name}</h3>
                  <span className="text-sm text-slate-300">Budget: {project.budgetUsed}%</span>
                </div>
                <p className="text-sm text-slate-400">Client: {project.client}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="dashboard" onNavigate={navigateToScreen} />
    </div>
  )

  const renderProjectDetail = () => {
    if (!selectedProject) return null

    const profit = selectedProject.income - selectedProject.expenses
    const isRentable = profit > 0

    return (
      <div className="min-h-screen bg-slate-800 text-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-slate-700">
          <Button onClick={goBack} variant="ghost" size="sm" className="text-white hover:bg-slate-700 mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">{selectedProject.name}</h1>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          <h2 className="text-xl font-bold">Rentabilidad</h2>

          {/* Financial Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-green-600 border-green-500 p-4">
              <div className="text-white">
                <p className="text-sm opacity-90">Ingresos</p>
                <p className="text-2xl font-bold">${selectedProject.income.toLocaleString()}</p>
              </div>
            </Card>
            <Card className="bg-red-600 border-red-500 p-4">
              <div className="text-white">
                <p className="text-sm opacity-90">Gastos</p>
                <p className="text-2xl font-bold">${selectedProject.expenses.toLocaleString()}</p>
              </div>
            </Card>
          </div>

          {/* Net Profit */}
          <Card className="bg-slate-700 border-slate-600 p-4">
            <div className="text-white">
              <p className="text-sm text-slate-300">Ganancia Neta</p>
              <p className="text-3xl font-bold">${profit.toLocaleString()}</p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => {
                setTransactionType("income")
                setShowTransactionModal(true)
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Agregar Ingreso
            </Button>
            <Button
              onClick={() => {
                setTransactionType("expense")
                setShowTransactionModal(true)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Agregar Gasto
            </Button>
          </div>

          {/* Close Project Button */}
          <Button
            onClick={() => closeProject(selectedProject.id)}
            variant="outline"
            className="w-full border-slate-600 hover:bg-slate-700 text-black"
          >
            Cerrar Proyecto
          </Button>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Estado</span>
            <span className={`font-semibold ${isRentable ? "text-green-400" : "text-red-400"}`}>
              {isRentable ? "Rentable" : "No Rentable"}
            </span>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeScreen="dashboard" onNavigate={navigateToScreen} />
      </div>
    )
  }

  const renderReports = () => (
    <div className="min-h-screen bg-slate-800 text-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-700">
        <Button onClick={goBack} variant="ghost" size="sm" className="text-white hover:bg-slate-700 mr-3">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-semibold">Reportes</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold">General</h2>

        {/* General Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-slate-700 border-slate-600 p-4">
            <div className="text-white">
              <p className="text-sm text-slate-300">Rentabilidad</p>
              <p className="text-xl font-bold">$120,000</p>
              <p className="text-sm text-green-400">+15%</p>
            </div>
          </Card>
          <Card className="bg-slate-700 border-slate-600 p-4">
            <div className="text-white">
              <p className="text-sm text-slate-300">Ingreso</p>
              <p className="text-xl font-bold">$350,000</p>
              <p className="text-sm text-green-400">+10%</p>
            </div>
          </Card>
        </div>

        <Card className="bg-slate-700 border-slate-600 p-4">
          <div className="text-white">
            <p className="text-sm text-slate-300">Gastos</p>
            <p className="text-xl font-bold">$230,000</p>
            <p className="text-sm text-red-400">-5%</p>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Rentabilidad</h3>
          <Card className="bg-slate-700 border-slate-600 p-4">
            <div className="text-white mb-4">
              <p className="text-sm text-slate-300">Rentabilidad del proyecto</p>
              <p className="text-2xl font-bold">$120,000</p>
              <p className="text-sm text-slate-400">
                Últimos 12 meses <span className="text-green-400">+15%</span>
              </p>
            </div>
            <div className="h-32 bg-slate-600 rounded flex items-end justify-center">
              <p className="text-slate-400 text-sm">Gráfico de línea temporal</p>
            </div>
          </Card>

          <h3 className="text-lg font-semibold">Ingresos vs. Gastos</h3>
          <Card className="bg-slate-700 border-slate-600 p-4">
            <div className="text-white mb-4">
              <p className="text-sm text-slate-300">Ingresos vs. Gastos</p>
              <p className="text-2xl font-bold">$350,000</p>
              <p className="text-sm text-slate-400">
                Últimos 12 meses <span className="text-green-400">+10%</span>
              </p>
            </div>
            <div className="h-32 bg-slate-600 rounded flex items-end justify-center">
              <p className="text-slate-400 text-sm">Gráfico de barras comparativas</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="reports" onNavigate={navigateToScreen} />
    </div>
  )

  const renderHistory = () => (
    <div className="min-h-screen bg-slate-800 text-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-700">
        <Button onClick={goBack} variant="ghost" size="sm" className="text-white hover:bg-slate-700 mr-3">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-semibold">Proyectos Cerrados</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {closedProjects.map((project) => {
          const profit = project.income - project.expenses
          return (
            <Card key={project.id} className="bg-slate-700 border-slate-600 p-4">
              <div className="text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{project.name}</h3>
                  <span className={`text-sm font-medium ${profit > 0 ? "text-green-400" : "text-red-400"}`}>
                    Ganancia: ${profit.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Ingresos: ${project.income.toLocaleString()} | Gastos: ${project.expenses.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Cliente: {project.client}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="history" onNavigate={navigateToScreen} />
    </div>
  )

  const renderSettings = () => (
    <div className="min-h-screen bg-slate-800 text-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-700">
        <Button onClick={goBack} variant="ghost" size="sm" className="text-white hover:bg-slate-700 mr-3">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-semibold">Ajustes</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Account Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Cuenta</h3>
          <div className="space-y-2">
            <Card className="bg-slate-700 border-slate-600 p-4 cursor-pointer hover:bg-slate-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Información personal</p>
                  <p className="text-sm text-slate-400">Administra tu información personal</p>
                </div>
              </div>
            </Card>
            <Card className="bg-slate-700 border-slate-600 p-4 cursor-pointer hover:bg-slate-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Seguridad</p>
                  <p className="text-sm text-slate-400">Cambia tu contraseña</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Preferencias</h3>
          <div className="space-y-2">
            <Card className="bg-slate-700 border-slate-600 p-4 cursor-pointer hover:bg-slate-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Moneda</p>
                  <p className="text-sm text-slate-400">Selecciona tu moneda preferida</p>
                </div>
              </div>
            </Card>
            <Card className="bg-slate-700 border-slate-600 p-4 cursor-pointer hover:bg-slate-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Notificaciones</p>
                  <p className="text-sm text-slate-400">Configura tus notificaciones</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Soporte</h3>
          <div className="space-y-2">
            <Card className="bg-slate-700 border-slate-600 p-4 cursor-pointer hover:bg-slate-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Ayuda y soporte</p>
                  <p className="text-sm text-slate-400">Contacta a nuestro equipo de soporte</p>
                </div>
              </div>
            </Card>
            <Card className="bg-slate-700 border-slate-600 p-4 cursor-pointer hover:bg-slate-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Enviar comentarios</p>
                  <p className="text-sm text-slate-400">Envía tus comentarios</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="settings" onNavigate={navigateToScreen} />
    </div>
  )

  // Bottom Navigation Component
  const BottomNavigation = ({
    activeScreen,
    onNavigate,
  }: { activeScreen: Screen; onNavigate: (screen: Screen) => void }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700">
      <div className="flex items-center justify-around py-2">
        <Button
          onClick={() => onNavigate("dashboard")}
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center space-y-1 ${activeScreen === "dashboard" ? "text-indigo-400" : "text-slate-400"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Inicio</span>
        </Button>
        <Button
          onClick={() => onNavigate("reports")}
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center space-y-1 ${activeScreen === "reports" ? "text-indigo-400" : "text-slate-400"}`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs">Reportes</span>
        </Button>
        <Button
          onClick={() => onNavigate("history")}
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center space-y-1 ${activeScreen === "history" ? "text-indigo-400" : "text-slate-400"}`}
        >
          <History className="w-5 h-5" />
          <span className="text-xs">Historial</span>
        </Button>
        <Button
          onClick={() => onNavigate("settings")}
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center space-y-1 ${activeScreen === "settings" ? "text-indigo-400" : "text-slate-400"}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">Ajustes</span>
        </Button>
      </div>
    </div>
  )

  // New Project Modal
  const NewProjectModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      client: "",
      budget: "",
      initialPayment: "",
      image: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (formData.name && formData.client && formData.budget) {
        createProject(formData)
        setFormData({ name: "", client: "", budget: "", initialPayment: "", image: "" })
      }
    }

    return (
      <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Nuevo Proyecto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nombre del proyecto"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
            <Input
              placeholder="Cliente"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
            <Input
              type="number"
              placeholder="Presupuesto inicial"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
            <Input
              type="number"
              placeholder="Pago inicial (opcional)"
              value={formData.initialPayment}
              onChange={(e) => setFormData({ ...formData, initialPayment: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <Input
              type="url"
              placeholder="URL de la imagen del proyecto (opcional)"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                variant="outline"
                className="flex-1 border-slate-600 hover:bg-slate-700 text-black"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                Crear Proyecto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // Transaction Modal
  const TransactionModal = () => {
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (amount && selectedProject) {
        const updatedProjects = projects.map((p) => {
          if (p.id === selectedProject.id) {
            const newAmount = Number.parseFloat(amount)
            return {
              ...p,
              [transactionType === "income" ? "income" : "expenses"]:
                p[transactionType === "income" ? "income" : "expenses"] + newAmount,
            }
          }
          return p
        })
        setProjects(updatedProjects)
        setSelectedProject(updatedProjects.find((p) => p.id === selectedProject.id) || null)
        setShowTransactionModal(false)
        setAmount("")
        setDescription("")
      }
    }

    return (
      <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{transactionType === "income" ? "Agregar Ingreso" : "Agregar Gasto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              placeholder="Monto"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
            <Input
              placeholder="Descripción (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={() => setShowTransactionModal(false)}
                variant="outline"
                className="flex-1 border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${transactionType === "income" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                {transactionType === "income" ? "Agregar Ingreso" : "Agregar Gasto"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // Main render
  return (
    <div className="font-sans">
      {currentScreen === "login" && renderLogin()}
      {currentScreen === "dashboard" && renderDashboard()}
      {currentScreen === "project-detail" && renderProjectDetail()}
      {currentScreen === "reports" && renderReports()}
      {currentScreen === "history" && renderHistory()}
      {currentScreen === "settings" && renderSettings()}

      <NewProjectModal />
      <TransactionModal />
    </div>
  )
}
