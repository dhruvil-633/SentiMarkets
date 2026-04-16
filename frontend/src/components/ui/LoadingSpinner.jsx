export default function LoadingSpinner({ size = 'md', center = false }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
  return (
    <div className={center ? 'flex items-center justify-center w-full h-full min-h-[200px]' : 'inline-flex'}>
      <div className={`${s} border-2 border-border border-t-primary rounded-full animate-spin`} />
    </div>
  )
}
