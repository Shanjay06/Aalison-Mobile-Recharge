import { useTheme } from '../App'

const Footer = () => {
  const theme = useTheme()
  
  return (
    <footer style={{
      background: theme.colors.cardBg,
      borderTop: `1px solid ${theme.colors.border}`,
      padding: '40px 0',
      marginTop: '80px'
    }}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center'}}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#e60012',
          marginBottom: '16px'
        }}>
          Aalison
        </h3>
        <p style={{color: theme.colors.textSecondary, marginBottom: '20px', fontSize: '16px'}}>
          Your trusted partner for instant mobile recharge services
        </p>
        <p style={{color: theme.colors.textSecondary, fontSize: '14px'}}>
          &copy; 2024 Aalison Recharge. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer