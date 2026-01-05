export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#FFFCF9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#373436] mb-8">My Account</h1>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#373436]">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#373436]/70">Name</label>
                <p className="mt-1 text-[#373436]">John Doe</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#373436]/70">Email</label>
                <p className="mt-1 text-[#373436]">john.doe@example.com</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#373436]">Order History</h2>
            <p className="text-gray-500">No orders yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}