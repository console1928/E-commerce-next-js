import Loader from '@components/Loader'

export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Loader />
    </div>
  )
}