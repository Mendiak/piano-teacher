export default function ClickToStart({ onStart }) {
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
      zIndex: 2000,
      color: 'white',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Bienvenido a Piano Teacher</h2>
        <p style={{ marginBottom: '1rem' }}>Tu asistente personal para aprender a tocar el piano con tu teclado MIDI.</p>
        <p style={{ marginBottom: '1rem' }}>La aplicación ha sido testeada y optimizada para Google Chrome y Mozilla Firefox.</p>
        <p style={{ marginBottom: '1rem' }}>Asegúrate de aceptar los permisos de tu navegador para acceder a dispositivos MIDI.</p>
        <p style={{ marginBottom: '2rem' }}>Para comenzar tu experiencia musical, haz clic en el botón.</p>
        <button 
          onClick={onStart}
          style={{
            fontSize: '1.5rem',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'var(--accent)',
            color: 'white',
          }}
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}
