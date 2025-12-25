# Frontend Architecture & Data Flow

## 1. Philosophy
The frontend treats the backend as a **Black Box**. It does not know about SQL, schemas, or calculation logic. It simply requests data via Services and renders it via Components.

## 2. Data Flow
1.  **Component (View):** User interaction triggers an action (e.g., `useEffect` on mount, or `onClick`).
2.  **Service Layer (Adapter):** The component calls a function in `frontend/src/services/`. This layer handles Axios configuration, header injection, and error normalization.
3.  **API:** Request hits the backend.
4.  **State Update:** React state is updated with the `response.data`.

## 3. Example Service

```typescript
// services/issueService.ts
import api from './api';

export const fetchBuildingIssues = async (buildingId: string) => {
  const response = await api.get(`/tickets/building/${buildingId}`, {
    headers: { 'x-mock-user-id': 'current-user-id' }
  });
  return response.data.data; 
};
```

## 4. Component Usage Example

```tsx
const MapComponent = ({ buildingId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuildingIssues(buildingId)
      .then(data => setIssues(data))
      .finally(() => setLoading(false));
  }, [buildingId]);

  if (loading) return <Spinner />;
  
  return (
    <div>
      {issues.map(issue => <Pin key={issue.id} x={issue.x} y={issue.y} />)}
    </div>
  );
};
```
