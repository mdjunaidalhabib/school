import React from "react";
const Cord3 = ({ student }) => {
  if (!student) return null;

  const formattedDob = student.dob
    ? new Date(student.dob).toLocaleDateString("en-GB", {
        year: "numeric", // যেমন: "2022"
        month: "numeric", // যেমন: "August" long
        day: "numeric", // যেমন: "27"
      })
    : "N/A";

  return (
    <div>
      <div className="w-[280px] h-[440px] bg-white overflow-hidden">
        <div className="relative w-[300px] h-[472px]">
          <div className="absolute w-[300px] h-[450px] top-[22px] left-0 bg-[#c4c5fa]" />

          <div className="absolute w-[300px] h-[450px] top-0 left-0 bg-[#c4c5fa]" />

          <img
            className="absolute w-[280px] h-[146px] top-[11px] left-0"
            alt="Rectangle"
            src="/Rectangle 3.svg"
          />

          <img
            className="absolute w-[280px] h-[148px] top-0 left-0"
            alt="Rectangle"
            src="/Rectangle 8.svg"
          />
          <div className="relative">
            {student.imageUrl ? (
              <img
                className="absolute w-[100px] h-[100px] top-[74px] left-[90px] rounded-full object-cover border-4 border-sky-500"
                alt="Student"
                src={student.imageUrl}
              />
            ) : (
              <div className="absolute w-[100px] h-[100px] top-[74px] left-[90px] rounded-full bg-gray-200 text-gray-600 border-4 border-sky-500">
                <span className="text-xs absolute w-[100px] h-[100px] top-[30px] left-[20px] ">
                  Photo Not Available
                </span>
              </div>
            )}
          </div>

          <img
            className="absolute w-[105px] h-[37px] top-[403px] left-[175px]"
            alt="Rectangle"
            src="/Rectangle 6.svg"
          />

          <img
            className="absolute w-[280px] h-[37px] top-[403px] left-0"
            alt="Rectangle"
            src="/Rectangle 5.svg"
          />

          <div className="absolute top-48 w-full flex justify-center items-center [font-family:'Inter-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[normal] whitespace-nowrap">
            {student.name || "No Name"}
          </div>

          <div className="absolute p-1 h-[22px] top-52 left-[95px] [font-family:'Jomolhari-Regular',Helvetica] font-normal text-black text-sm text-center tracking-[0] leading-[normal]">
            I am a student
          </div>

          <p className=" mt-4 absolute w-[95px] h-[215px] top-[230px] left-8 [font-family:'Jomolhari-Regular',Helvetica] font-normal text-black text-[13px] tracking-[0] leading-[normal]">
            ID
            <br />
            Father’s Name
            <br />
            Class
            <br />
            Date Of Birth
            <br />
            District
            <br />
            Police Station
            <br />
            Blood Group
            <br />
            Mobile
          </p>

          <p className="mt-5 pt-1 absolute w-[141px] h-[215px] top-[209px] left-32 [font-family:'Jomolhari-Regular',Helvetica] font-normal text-black text-[13px] tracking-[0] leading-[normal]">
            <br />: {student.id || "N/A"}
            <br />: {student.fatherName || "N/A"}
            <br />: {student.currentClass?.name || "N/A"}
            <br />: {formattedDob}
            <br />: {student.district?.name || "N/A"}
            <br />: {student.thana?.name || "N/A"}
            <br />: A-
            <br />: {student.phone || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cord3;
