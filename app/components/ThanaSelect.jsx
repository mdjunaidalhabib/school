import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchThanas = async (districtId) => {
  if (!districtId) return [];
  const { data } = await axios.get("/api/divisions");
  const selectedDistrict = data
    .flatMap((div) => div.districts)
    .find((dist) => dist.id === parseInt(districtId));
  return selectedDistrict ? selectedDistrict.thanas : [];
};

const ThanaSelect = ({ districtId, onSelect, disabled }) => {
  const { data: thanas, isLoading, error } = useQuery({
    queryKey: ["thanas", districtId],
    queryFn: () => fetchThanas(districtId),
    enabled: !!districtId,
  });

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="border p-2 rounded"
      disabled={disabled}
    >
      <option value="">থানা নির্বাচন করুন</option>
      {thanas?.map((thana) => (
        <option key={thana.id} value={thana.id || ""}>
          {thana.name}
        </option>
      ))}
    </select>
  );
};

export default ThanaSelect;
