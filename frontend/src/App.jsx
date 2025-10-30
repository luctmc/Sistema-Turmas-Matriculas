import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from './services/api.js';
import { LoginForm } from './components/LoginForm.jsx';
import { ResourcePanel } from './components/ResourcePanel.jsx';

const defaultCourse = { name: '', code: '', workload: 60, status: 'active' };
const defaultStudent = { name: '', email: '', document: '', phone: '', birthDate: '' };
const defaultClass = { name: '', courseId: '', startDate: '', endDate: '', capacity: 30 };
const defaultEnrollment = { studentId: '', classId: '' };

function useApiData(token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [courseRes, studentRes, classRes, enrollmentRes] = await Promise.all([
        api.get('/courses'),
        api.get('/students'),
        api.get('/classes'),
        api.get('/enrollments')
      ]);
      setCourses(courseRes.data);
      setStudents(studentRes.data);
      setClasses(classRes.data);
      setEnrollments(enrollmentRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return useMemo(
    () => ({
      reload: loadAll,
      loading,
      error,
      courses,
      students,
      classes,
      enrollments
    }),
    [loadAll, loading, error, courses, students, classes, enrollments]
  );
}

function Dashboard({ onLogout, user, data }) {
  const [courseForm, setCourseForm] = useState(defaultCourse);
  const [studentForm, setStudentForm] = useState(defaultStudent);
  const [classForm, setClassForm] = useState(defaultClass);
  const [enrollmentForm, setEnrollmentForm] = useState(defaultEnrollment);
  const [feedback, setFeedback] = useState('');
  const { reload, courses, students, classes, enrollments, loading, error } = data;

  const handleChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/courses', { ...courseForm, workload: Number(courseForm.workload) });
      setCourseForm(defaultCourse);
      setFeedback('Curso criado com sucesso');
      await reload();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Erro ao criar curso');
    }
  };

  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/students', studentForm);
      setStudentForm(defaultStudent);
      setFeedback('Estudante cadastrado com sucesso');
      await reload();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Erro ao criar estudante');
    }
  };

  const handleClassSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/classes', {
        ...classForm,
        courseId: Number(classForm.courseId),
        capacity: Number(classForm.capacity)
      });
      setClassForm(defaultClass);
      setFeedback('Turma criada com sucesso');
      await reload();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Erro ao criar turma');
    }
  };

  const handleEnrollmentSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/enrollments', {
        ...enrollmentForm,
        studentId: Number(enrollmentForm.studentId),
        classId: Number(enrollmentForm.classId)
      });
      setEnrollmentForm(defaultEnrollment);
      setFeedback('Matrícula registrada com sucesso');
      await reload();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Erro ao criar matrícula');
    }
  };

  return (
    <div className="layout">
      <header className="app-header">
        <div>
          <h1>Sistema de Turmas e Matrículas</h1>
          <p>Bem-vindo(a), {user.name}</p>
        </div>
        <button onClick={onLogout}>Sair</button>
      </header>

      {feedback && <p className="feedback">{feedback}</p>}
      {error && <p className="error">{error}</p>}
      {loading && <p>Carregando dados...</p>}

      <div className="grid">
        <ResourcePanel
          title="Cursos"
          actions={
            <form className="inline-form" onSubmit={handleCourseSubmit}>
              <input name="name" placeholder="Nome" value={courseForm.name} onChange={handleChange(setCourseForm)} required />
              <input name="code" placeholder="Código" value={courseForm.code} onChange={handleChange(setCourseForm)} required />
              <input
                name="workload"
                type="number"
                min="1"
                placeholder="Carga"
                value={courseForm.workload}
                onChange={handleChange(setCourseForm)}
                required
              />
              <select name="status" value={courseForm.status} onChange={handleChange(setCourseForm)}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
              <button type="submit">Adicionar</button>
            </form>
          }
          data={courses}
          columns={[
            { key: 'code', label: 'Código' },
            { key: 'name', label: 'Nome' },
            { key: 'workload', label: 'Carga Horária' },
            { key: 'status', label: 'Status' }
          ]}
        />

        <ResourcePanel
          title="Estudantes"
          actions={
            <form className="inline-form" onSubmit={handleStudentSubmit}>
              <input name="name" placeholder="Nome" value={studentForm.name} onChange={handleChange(setStudentForm)} required />
              <input name="email" placeholder="Email" value={studentForm.email} onChange={handleChange(setStudentForm)} required />
              <input name="document" placeholder="Documento" value={studentForm.document} onChange={handleChange(setStudentForm)} required />
              <input name="phone" placeholder="Telefone" value={studentForm.phone} onChange={handleChange(setStudentForm)} />
              <input name="birthDate" type="date" value={studentForm.birthDate} onChange={handleChange(setStudentForm)} />
              <button type="submit">Cadastrar</button>
            </form>
          }
          data={students}
          columns={[
            { key: 'name', label: 'Nome' },
            { key: 'email', label: 'Email' },
            { key: 'document', label: 'Documento' }
          ]}
        />

        <ResourcePanel
          title="Turmas"
          actions={
            <form className="inline-form" onSubmit={handleClassSubmit}>
              <input name="name" placeholder="Nome" value={classForm.name} onChange={handleChange(setClassForm)} required />
              <select name="courseId" value={classForm.courseId} onChange={handleChange(setClassForm)} required>
                <option value="">Curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <input name="startDate" type="date" value={classForm.startDate} onChange={handleChange(setClassForm)} required />
              <input name="endDate" type="date" value={classForm.endDate} onChange={handleChange(setClassForm)} required />
              <input
                name="capacity"
                type="number"
                min="1"
                value={classForm.capacity}
                onChange={handleChange(setClassForm)}
                required
              />
              <button type="submit">Criar</button>
            </form>
          }
          data={classes}
          columns={[
            { key: 'name', label: 'Turma' },
            {
              key: 'course',
              label: 'Curso',
              render: (_value, row) => row.course?.name || '—'
            },
            { key: 'startDate', label: 'Início' },
            { key: 'endDate', label: 'Fim' },
            { key: 'capacity', label: 'Vagas' }
          ]}
        />

        <ResourcePanel
          title="Matrículas"
          actions={
            <form className="inline-form" onSubmit={handleEnrollmentSubmit}>
              <select name="studentId" value={enrollmentForm.studentId} onChange={handleChange(setEnrollmentForm)} required>
                <option value="">Estudante</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <select name="classId" value={enrollmentForm.classId} onChange={handleChange(setEnrollmentForm)} required>
                <option value="">Turma</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button type="submit">Matricular</button>
            </form>
          }
          data={enrollments}
          columns={[
            {
              key: 'student',
              label: 'Estudante',
              render: (_value, row) => row.student?.name || '—'
            },
            {
              key: 'class',
              label: 'Turma',
              render: (_value, row) => row.class?.name || '—'
            },
            {
              key: 'course',
              label: 'Curso',
              render: (_value, row) => row.class?.course?.name || '—'
            },
            { key: 'status', label: 'Status' }
          ]}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const data = useApiData(token);

  useEffect(() => {
    const savedToken = window.localStorage.getItem('stm_token');
    const savedUser = window.localStorage.getItem('stm_user');
    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: jwt, user: profile } = response.data;
    setAuthToken(jwt);
    setToken(jwt);
    setUser(profile);
    window.localStorage.setItem('stm_token', jwt);
    window.localStorage.setItem('stm_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setAuthToken(null);
    setToken('');
    setUser(null);
    window.localStorage.removeItem('stm_token');
    window.localStorage.removeItem('stm_user');
  };

  if (!token || !user) {
    return (
      <div className="layout centered">
        <LoginForm onLogin={handleLogin} />
        <p className="helper">
          Crie um usuário administrador via POST <code>/api/auth/register</code> antes de autenticar.
        </p>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} user={user} data={data} />;
}
