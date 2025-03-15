import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-60 bg-gray-800 text-white h-screen p-4 fixed">
      <Link href="/" className="hover:bg-purple-700 mb-4 p-2 block">
        Dashboard
      </Link>

      <Link
        href="../src/allstudents"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        All Students
      </Link>

      <Link
        href="../src/Allteachers"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        All Teacher
      </Link>

      <Link
        href="../src/Addteachers"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        Add teachers
      </Link>

      <Link href="../src/divi" className="hover:bg-purple-700 mb-4 p-2 block">
        Add divi
      </Link>

      <Link
        href="../src/Classes"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        Add Classes
      </Link>

      <Link
        href="../src/StudentFeeDashboard"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        StudentFeeDashboard
      </Link>

      <Link
        href="../src/fee-setup"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        fee-setup
      </Link>

      <Link
        href="../src/StudentFeeCreate"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        StudentFeeCreate
      </Link>

      <Link
        href="../src/testClass"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        testClass
      </Link>
      <Link
        href="../src/idcordMake"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        ID CORD MAKE
      </Link>
      <Link href="../src/idcord" className="hover:bg-purple-700 mb-4 p-2 block">
        Id cord
      </Link>

      <Link
        href="../src/ImageUpload"
        className="hover:bg-purple-700 mb-4 p-2 block"
      >
        ImageUpload
      </Link>
    </div>
  );
}
