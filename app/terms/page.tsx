export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Términos y Condiciones</h1>
          
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Aceptación de Términos</h2>
          <p>
            Al acceder y utilizar Nexora, aceptas estar sujeto a estos términos y condiciones. 
            Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestro servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
          <p>
            Nexora es una biblioteca de herramientas digitales en línea que proporciona diversos servicios 
            como formateo de JSON, generación de contraseñas, selección de colores, conversión de Markdown, 
            herramientas de IA y más. Todas las herramientas se ejecutan en tu navegador cuando sea posible, 
            garantizando privacidad y seguridad.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Uso del Servicio</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Debes tener al menos 13 años para utilizar este servicio</li>
            <li>Es tu responsabilidad mantener la seguridad de tu cuenta</li>
            <li>No puedes utilizar el servicio para actividades ilegales o no autorizadas</li>
            <li>No puedes intentar interferir con el funcionamiento del servicio</li>
            <li>No puedes reproducir, duplicar, copiar, vender o explotar ninguna parte del servicio</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Privacidad y Datos</h2>
          <p>
            La mayoría de nuestras herramientas se ejecutan localmente en tu navegador. No almacenamos 
            tus datos personales sin tu consentimiento explícito. Consulta nuestra Política de Privacidad 
            para más detalles sobre cómo manejamos tu información.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Propiedad Intelectual</h2>
          <p>
            Todo el contenido, características y funcionalidades de Nexora son propiedad exclusiva 
            de Nexora y están protegidos por leyes de derechos de autor y otros tratados internacionales.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitación de Responsabilidad</h2>
          <p>
            Nexora no se hace responsable de ningún daño directo, indirecto, incidental o consecuente 
            que resulte del uso o la incapacidad de usar nuestro servicio. El servicio se proporciona 
            "tal cual" sin garantías de ningún tipo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las 
            modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
          <p>
            Si tienes preguntas sobre estos términos y condiciones, por favor contáctanos a través 
            de los canales proporcionados en nuestro sitio.
          </p>
        </section>

        <p className="text-sm text-muted-foreground">
          Última actualización: Julio 2026
        </p>
      </div>
    </div>
  )
}
