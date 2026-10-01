import AdminLayout from "../../layouts/AdminLayout";

function Departments() {
  const departments = [
    {
      name: "Sanitation",
      head: "John Mathew",
      pending: 12,
      resolved: 85,
    },
    {
      name: "Roads",
      head: "Arun Kumar",
      pending: 8,
      resolved: 60,
    },
    {
      name: "Water Supply",
      head: "Rahul Das",
      pending: 15,
      resolved: 72,
    },
    {
      name: "Electrical",
      head: "Anil Joseph",
      pending: 5,
      resolved: 95,
    },
  ];

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Departments
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">

        {departments.map((dept, index) => (

          <div
            key={index}
            className="bg-[#111827] rounded-2xl p-6 border border-gray-800"
          >

            <h2 className="text-2xl font-bold text-white">
              {dept.name}
            </h2>

            <p className="text-gray-400 mt-2">
              Head : {dept.head}
            </p>

            <div className="flex justify-between mt-6">

              <div>

                <p className="text-yellow-400 text-3xl font-bold">
                  {dept.pending}
                </p>

                <p className="text-gray-400">
                  Pending
                </p>

              </div>

              <div>

                <p className="text-green-400 text-3xl font-bold">
                  {dept.resolved}
                </p>

                <p className="text-gray-400">
                  Resolved
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </AdminLayout>
  );
}

export default Departments;