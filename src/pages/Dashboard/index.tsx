import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem('@GithubExplore:repositories');

    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    } else {
      return [];
    }
  });
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');

  useEffect(() => {
    localStorage.setItem('@GithubExplore:repositories', JSON.stringify(repositories));
  }, [repositories]);

  const handleAddRepository = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      if (!newRepo) {
        setInputError('Digite o autor/nome do repositório.');
        return;
      }

      try {
        const response = await api.get<Repository>(`repos/${newRepo}`);
        const repository = response.data;
        setRepositories([...repositories, repository]);
        setNewRepo('');
        setInputError('');
      } catch (err) {
        setInputError('Erro na busca por esse repositório.');
      }
    },
    [newRepo, repositories],
  );

  return (
    <>
      <img src={logoImg} alt="" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <a key={repository.full_name} href="teste">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.owner.login}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
