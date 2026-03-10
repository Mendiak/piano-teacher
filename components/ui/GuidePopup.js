import { FaTimes } from 'react-icons/fa';

export default function GuidePopup({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'var(--controls-bg)',
        color: 'var(--fg)',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--fg)', fontSize: '1.5rem', cursor: 'pointer' }}>
          <FaTimes />
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '1rem' }}>Guía de Usuario</h2>
        <p style={{ marginBottom: '1rem' }}>Esta aplicación ha sido testeada y optimizada para funcionar en Google Chrome y Mozilla Firefox.</p>
        
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Conectar un Teclado MIDI USB</h3>
        <p>
          1. Conecta tu teclado MIDI a tu ordenador mediante un cable USB.<br />
          2. **Acepta los permisos de tu navegador** para que la aplicación pueda acceder a tus dispositivos MIDI (se recomienda Chrome o Firefox).<br />
          3. Recarga la página. La aplicación debería detectar tu teclado automáticamente. Verás el nombre de tu dispositivo en la cabecera.
        </p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Funcionalidades Principales</h3>
        <p><strong>Selección de Canción:</strong> Elige una canción de la lista o sube tu propio archivo MIDI (.mid) seleccionando &quot;Subir MIDI propio&quot;.</p>
        <p><strong>Modo de Juego:</strong></p>
        <ul>
          <li><strong>&quot;Paso a paso:&quot;</strong> Las notas no avanzan hasta que toques la nota correcta. Ideal para aprender la melodía a tu propio ritmo.</li>
          <li><strong>&quot;Falling notes:&quot;</strong> Las notas caen a una velocidad constante. ¡Intenta tocarlas en el momento justo!</li>
        </ul>
        <p><strong>Control de Tempo:</strong> Ajusta la velocidad de la canción en el modo &quot;Falling notes&quot;.</p>
        <p><strong>Sonido:</strong> Elige entre diferentes sonidos de sintetizador para el piano.</p>
        <p><strong>Envolvente (ADSR):</strong> Personaliza el sonido del sintetizador ajustando el Ataque, Decaimiento, Sostenido y Relajación.</p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Controles de Reproducción</h3>
        <p><strong>Reproducir:</strong> Inicia la reproducción de la canción.</p>
        <p><strong>Detener:</strong> Para la reproducción.</p>
        <p><strong>Mostrar Resultados:</strong> Muestra una ventana emergente con tu puntuación, combo máximo, y otros datos de la partida.</p>
        <p><strong>Reiniciar Puntuación:</strong> Borra los resultados de la partida actual.</p>
      </div>
    </div>
  );
}
