import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchDivisions = async () => {
  const { data } = await axios.get('/api/divisions');
  return data;
};

const DivisionSelect = ({ onSelect }) => {
  const { data: divisions, isLoading, error } = useQuery({
    queryKey: ['divisions'],
    queryFn: fetchDivisions,
  });

  if (isLoading) return <p>লোড হচ্ছে...</p>;
  if (error) return <p>ডাটা লোড করতে সমস্যা হয়েছে!</p>;

  const handleChange = (e) => {
    // value string আসছে, তবে তুমি যদি number চাই, তবে parseInt() ব্যবহার করো
    const selectedDivisionId = parseInt(e.target.value, 10); // 10 হচ্ছে base (decimal)
    onSelect(selectedDivisionId);
  };

  return (
    <select onChange={handleChange} className="border p-2 rounded">
      <option value="">বিভাগ নির্বাচন করুন</option>
      {divisions.map((division) => (
        <option key={division.id} value={division.id}>
          {division.name}
        </option>
      ))}
    </select>
  );
};

export default DivisionSelect;
