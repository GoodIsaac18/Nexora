export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Política de Privacidad</h1>
          
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Información que Recopilamos</h2>
          <p>
            En Nexora, nos comprometemos a proteger tu privacidad. La mayoría de nuestras herramientas 
            se ejecutan localmente en tu navegador, lo que significa que tus datos no se envían a 
            nuestros servidores. Sin embargo, podemos recopilar:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Datos de uso anónimos para mejorar nuestros servicios</li>
            <li>Preferencias de tema (claro/oscuro) almacenadas localmente</li>
            <li>Consentimiento de cookies almacenado localmente</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Cómo Usamos tu Información</h2>
          <p>
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mejorar la funcionalidad y rendimiento de nuestras herramientas</li>
            <li>Personalizar tu experiencia (tema, preferencias)</li>
            <li>Analizar tendencias de uso de forma anónima</li>
            <li>Cumplir con obligaciones legales cuando sea necesario</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Herramientas de IA</h2>
          <p>
            Algunas de nuestras herramientas de IA (Parafraseador, Detector de IA, Analizador de CV, 
            Chat General) envían datos a servicios externos (Google AI) para procesamiento. 
            Estos datos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>No se almacenan permanentemente en nuestros servidores</li>
            <li>Pueden ser procesados por el servicio de IA externo según sus políticas</li>
            <li>Se utilizan únicamente para proporcionar el servicio solicitado</li>
            <li>Se aplican medidas de seguridad para prevenir inyecciones de código</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
          <p>
            Utilizamos cookies para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Recordar tu consentimiento de cookies</li>
            <li>Guardar tus preferencias de tema</li>
            <li>Analizar el tráfico del sitio de forma anónima</li>
          </ul>
          <p className="mt-4">
            Puedes gestionar tus preferencias de cookies a través de nuestro banner de cookies 
            o la configuración de tu navegador.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Seguridad de Datos</h2>
          <p>
            Implementamos medidas de seguridad para proteger tu información:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sanitización de inputs para prevenir ataques XSS</li>
            <li>Rate limiting en nuestras APIs</li>
            <li>Ejecución local de herramientas cuando sea posible</li>
            <li>Conexiones HTTPS seguras</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Tus Derechos</h2>
          <p>
            Tienes derecho a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acceder a tus datos personales</li>
            <li>Solicitar la corrección de datos inexactos</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Retirar tu consentimiento en cualquier momento</li>
            <li>Oponerte al procesamiento de tus datos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Terceros</h2>
          <p>
            Podemos compartir información con terceros solo en las siguientes circunstancias:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Con servicios de IA externos para procesar solicitudes</li>
            <li>Cuando sea requerido por ley</li>
            <li>Para proteger nuestros derechos y propiedad</li>
            <li>Con proveedores de servicios que nos ayudan a operar el sitio</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Cambios a esta Política</h2>
          <p>
            Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. 
            Te notificaremos de cambios importantes a través de nuestro sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
          <p>
            Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos, 
            por favor contáctanos a través de los canales proporcionados en nuestro sitio.
          </p>
        </section>

        <p className="text-sm text-muted-foreground">
          Última actualización: Julio 2026
        </p>
      </div>
    </div>
  )
}
