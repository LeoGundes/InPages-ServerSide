const fs = require('fs');
const path = require('path');

const comentariosPath = path.join(__dirname, '../comentarios.json');
const usuariosPath = path.join(__dirname, '../usuarios.json');

// Função auxiliar para ler comentários
function lerComentarios() {
  try {
    if (!fs.existsSync(comentariosPath)) {
      fs.writeFileSync(comentariosPath, '[]');
      return [];
    }
    const data = fs.readFileSync(comentariosPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler comentários:', error);
    return [];
  }
}

// Função auxiliar para salvar comentários
function salvarComentarios(comentarios) {
  try {
    fs.writeFileSync(comentariosPath, JSON.stringify(comentarios, null, 2));
  } catch (error) {
    console.error('Erro ao salvar comentários:', error);
    throw error;
  }
}

// Função auxiliar para ler usuários
function lerUsuarios() {
  try {
    const data = fs.readFileSync(usuariosPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
    return [];
  }
}

// Listar comentários de uma postagem
function listarComentarios(req, res) {
  try {
    const { postagemId } = req.params;
    const comentarios = lerComentarios();
    const usuarios = lerUsuarios();
    
    const comentariosDaPostagem = comentarios
      .filter(comentario => comentario.postagemId === postagemId)
      .map(comentario => {
        const usuario = usuarios.find(u => u.email === comentario.emailUsuario);
        return {
          ...comentario,
          nomeUsuario: usuario ? usuario.nome : 'Usuário não encontrado'
        };
      })
      .sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordenar por data crescente
    
    res.json(comentariosDaPostagem);
  } catch (error) {
    console.error('Erro ao listar comentários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Adicionar comentário
function adicionarComentario(req, res) {
  try {
    const { postagemId, emailUsuario, conteudo } = req.body;
    
    if (!postagemId || !emailUsuario || !conteudo) {
      return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' });
    }
    
    const comentarios = lerComentarios();
    const usuarios = lerUsuarios();
    
    // Verificar se o usuário existe
    const usuario = usuarios.find(u => u.email === emailUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const novoComentario = {
      id: Date.now().toString(),
      postagemId,
      emailUsuario,
      nomeUsuario: usuario.nome,
      conteudo,
      data: new Date().toISOString()
    };
    
    comentarios.push(novoComentario);
    salvarComentarios(comentarios);
    
    res.status(201).json(novoComentario);
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Deletar comentário
function deletarComentario(req, res) {
  try {
    const { id } = req.params;
    const { emailUsuario } = req.body;
    
    if (!emailUsuario) {
      return res.status(400).json({ error: 'Email do usuário é obrigatório' });
    }
    
    const comentarios = lerComentarios();
    const comentario = comentarios.find(c => c.id === id);
    
    if (!comentario) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    
    // Verificar se o usuário pode deletar o comentário (só pode deletar próprios comentários)
    if (comentario.emailUsuario !== emailUsuario) {
      return res.status(403).json({ error: 'Você só pode deletar seus próprios comentários' });
    }
    
    const comentariosAtualizados = comentarios.filter(c => c.id !== id);
    salvarComentarios(comentariosAtualizados);
    
    res.json({ message: 'Comentário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Editar comentário
function editarComentario(req, res) {
  try {
    const { id } = req.params;
    const { emailUsuario, conteudo } = req.body;
    
    if (!emailUsuario || !conteudo) {
      return res.status(400).json({ error: 'Email do usuário e conteúdo são obrigatórios' });
    }
    
    const comentarios = lerComentarios();
    const comentarioIndex = comentarios.findIndex(c => c.id === id);
    
    if (comentarioIndex === -1) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    
    const comentario = comentarios[comentarioIndex];
    
    // Verificar se o usuário pode editar o comentário (só pode editar próprios comentários)
    if (comentario.emailUsuario !== emailUsuario) {
      return res.status(403).json({ error: 'Você só pode editar seus próprios comentários' });
    }
    
    comentarios[comentarioIndex] = {
      ...comentario,
      conteudo,
      dataEdicao: new Date().toISOString()
    };
    
    salvarComentarios(comentarios);
    
    res.json(comentarios[comentarioIndex]);
  } catch (error) {
    console.error('Erro ao editar comentário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  listarComentarios,
  adicionarComentario,
  deletarComentario,
  editarComentario
};
