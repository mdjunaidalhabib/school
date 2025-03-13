import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDistricts = async (divisionId) => {
  if (!divisionId) return [];
  const { data } = await axios.get("/api/divisions");
  const selectedDivision = data.find((div) => div.id === parseInt(divisionId));
  return selectedDivision ? selectedDivision.districts : [];
};

const DistrictSelect = ({ divisionId, onSelect, disabled }) => {
  const {
    data: districts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["districts", divisionId],
    queryFn: () => fetchDistricts(divisionId),
    enabled: !!divisionId,
  });

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="border p-2 rounded"
      disabled={disabled}
    >
      <option value="">জেলা নির্বাচন করুন</option>
      {districts?.map((district) => (
        <option key={district.id} value={district.id}>
          {district.name}
        </option>
      ))}
    </select>
  );
};

export default DistrictSelect;
