export default function Sidebar() {
    return (
      <aside className="w-60 bg-gray-800 text-white h-screen p-4 fixed">
        <ul>
          <li className="mb-4"><a href="/" className="hover:underline">Dashboard</a></li>
          <li className="mb-4"><a href="../src/allstudents" className="hover:underline"> All Students</a></li>
          <li className="mb-4"><a href="../src/Admission" className="hover:underline"> Add Students</a></li>
          <li className="mb-4"><a href="../src/Allteachers" className="hover:underline"> All Teacher</a></li>
          <li className="mb-4"><a href="../src/Addteachers" className="hover:underline"> Add Teacher</a></li>
          <li className="mb-4"><a href="../src/divi" className="hover:underline">divi</a></li>
          <li className="mb-4"><a href="../src/Classes" className="hover:underline">Classes</a></li>
          <li className="mb-4"><a href="../src/StudentFeeDashboard" className="hover:underline">StudentFeeDashboard</a></li>
          <li className="mb-4"><a href="../src/fee-setup" className="hover:underline">fee-setup</a></li>
          <li className="mb-4"><a href="../src/StudentFeeCreate" lassName="hover:underline">StudentFeeCreate</a></li>
          <li className="mb-4"><a href="../src/testClass" className="hover:underline">TEST Class</a></li>
          <li className="mb-4"><a href="../src/idcord" className="hover:underline">ID CORD</a></li>
          <li className="mb-4"><a href="../src/ImageUpload" className="hover:underline">ImageUpload</a></li>
        </ul>
      </aside>
    );
  }
  