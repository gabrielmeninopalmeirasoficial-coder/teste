(function () {

  var modalHTML = '<div id="ggpix-modal" style="display:none;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.7);align-items:center;justify-content:center;">'
    + '<div style="background:#fff;border-radius:12px;padding:28px 24px;max-width:360px;width:94%;text-align:center;position:relative;font-family:Lato,sans-serif;">'
    + '<button onclick="ggpixFecharModal()" style="position:absolute;top:10px;right:14px;background:none;border:none;font-size:22px;color:#888;cursor:pointer;line-height:1;">×</button>'
    + '<div style="margin-bottom:16px;">'
    + '<div style="display:inline-flex;align-items:center;gap:6px;background:rgba(36,202,104,0.1);border:1px solid rgba(36,202,104,0.3);border-radius:100px;padding:4px 12px;font-size:11px;color:#24CA68;font-weight:700;margin-bottom:10px;"><span style="width:6px;height:6px;background:#24CA68;border-radius:50%;"></span> GGPIXAPI</div>'
    + '<h3 id="ggpix-titulo" style="margin:0 0 4px;font-size:18px;font-weight:700;color:#1a1a1a;">Gerando seu PIX...</h3>'
    + '<p id="ggpix-valor" style="margin:0;font-size:13px;color:#666;"></p>'
    + '</div>'
    + '<div id="ggpix-loading" style="padding:30px 0;">'
    + '<div style="width:40px;height:40px;border:3px solid #f0f0f0;border-top-color:#24CA68;border-radius:50%;margin:0 auto 12px;animation:ggpixSpin 0.8s linear infinite;"></div>'
    + '<p style="color:#888;font-size:13px;margin:0;">Aguarde...</p>'
    + '</div>'
    + '<div id="ggpix-qr" style="display:none;">'
    + '<img id="ggpix-qr-img" src="" alt="QR Code PIX" style="width:200px;height:200px;margin:0 auto 14px;display:block;border-radius:8px;" />'
    + '<p style="font-size:12px;color:#666;margin:0 0 8px;">Ou copie o codigo PIX:</p>'
    + '<div style="display:flex;gap:8px;align-items:center;background:#f5f5f5;border-radius:8px;padding:8px 12px;margin-bottom:16px;">'
    + '<input id="ggpix-copia-cola" type="text" readonly style="flex:1;border:none;background:none;font-size:11px;color:#333;outline:none;font-family:monospace;" />'
    + '<button onclick="ggpixCopiarCodigo()" style="background:#24CA68;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">Copiar</button>'
    + '</div>'
    + '<p id="ggpix-copiado" style="display:none;color:#24CA68;font-size:12px;font-weight:700;margin:0 0 12px;">Codigo copiado!</p>'
    + '<p style="font-size:11px;color:#aaa;margin:0;">O QR Code expira em 30 minutos.</p>'
    + '</div>'
    + '<div id="ggpix-erro" style="display:none;padding:16px 0;">'
    + '<p style="color:#e74c3c;font-size:14px;margin:0 0 12px;">Nao foi possivel gerar o PIX.<br>Tente novamente.</p>'
    + '<button onclick="ggpixFecharModal()" style="background:#e74c3c;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;">Fechar</button>'
    + '</div>'
    + '</div></div>'
    + '<style>@keyframes ggpixSpin{to{transform:rotate(360deg)}}</style>';

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  window.ggpixAbrirModal = function (amountCents, labelValor) {
    var modal   = document.getElementById('ggpix-modal');
    var loading = document.getElementById('ggpix-loading');
    var qrDiv   = document.getElementById('ggpix-qr');
    var erroDiv = document.getElementById('ggpix-erro');
    var titulo  = document.getElementById('ggpix-titulo');
    var valorEl = document.getElementById('ggpix-valor');

    loading.style.display = 'block';
    qrDiv.style.display   = 'none';
    erroDiv.style.display = 'none';
    titulo.textContent    = 'Gerando seu PIX...';
    valorEl.textContent   = 'Valor: ' + labelValor;
    modal.style.display   = 'flex';
    document.body.style.overflow = 'hidden';

    fetch('https://pix-backend-4c35.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountCents: amountCents })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.pixCopyPaste) {
        var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(data.pixCopyPaste);
        document.getElementById('ggpix-qr-img').src = qrUrl;
        document.getElementById('ggpix-copia-cola').value = data.pixCopyPaste;
        titulo.textContent    = 'PIX gerado!';
        valorEl.textContent   = 'Valor: ' + labelValor;
        loading.style.display = 'none';
        qrDiv.style.display   = 'block';
      } else {
        throw new Error('Resposta invalida');
      }
    })
    .catch(function () {
      loading.style.display = 'none';
      erroDiv.style.display = 'block';
    });
  };

  window.ggpixFecharModal = function () {
    document.getElementById('ggpix-modal').style.display = 'none';
    document.body.style.overflow = '';
  };

  window.ggpixCopiarCodigo = function () {
    var input = document.getElementById('ggpix-copia-cola');
    navigator.clipboard.writeText(input.value).then(function () {
      document.getElementById('ggpix-copiado').style.display = 'block';
      setTimeout(function () {
        document.getElementById('ggpix-copiado').style.display = 'none';
      }, 2500);
    });
  };

  document.getElementById('ggpix-modal').addEventListener('click', function (e) {
    if (e.target === this) ggpixFecharModal();
  });

  var mapaValores = {
    '8431f1de-8dd6-40fb-9a4a-d103f6531bf0': { cents: 3000,   label: 'R$ 30,00'    },
    '2780c289-e3d8-4dce-844e-49b550cece8c': { cents: 5000,   label: 'R$ 50,00'    },
    'b5d9d297-8d7e-4d63-ba8b-0dbcd6234562': { cents: 7000,   label: 'R$ 70,00'    },
    'c2253c88-0e39-4f97-a569-5919e9d1816f': { cents: 10000,  label: 'R$ 100,00'   },
    'b3a35a76-e890-4e00-a330-08fb71f16f36': { cents: 15000,  label: 'R$ 150,00'   },
    '87b8da3d-c68f-4683-bb8e-df948081d734': { cents: 20000,  label: 'R$ 200,00'   },
    '28b5cd4e-0b37-497d-b90c-cae19b319933': { cents: 30000,  label: 'R$ 300,00'   },
    '1f4d4341-21a5-47b2-acb5-b73e8d0087a0': { cents: 50000,  label: 'R$ 500,00'   },
    '89e65923-7f07-4fe3-8bf0-1ed301a5e870': { cents: 70000,  label: 'R$ 700,00'   },
    '6ca21f4f-a3c4-49db-a8b7-f2ad0c2f26b6': { cents: 100000, label: 'R$ 1.000,00' },
    '3d75a7bb-59b4-4466-ace8-8b93b9c29f8c': { cents: 150000, label: 'R$ 1.500,00' },
    'cab325cb-2127-4fbc-82e4-16cc417cd8b2': { cents: 200000, label: 'R$ 2.000,00' }
  };

  function interceptarLinks() {
    var links = document.querySelectorAll('a[href*="pay.pagfacil.xyz"]');
    links.forEach(function (link) {
      if (link.dataset.ggpixBound) return;
      link.dataset.ggpixBound = '1';
      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var href  = link.getAttribute('href') || '';
        var parts = href.split('/');
        var uuid  = parts[parts.length - 1].split('?')[0];
        var info  = mapaValores[uuid];
        if (info) {
          ggpixAbrirModal(info.cents, info.label);
        } else {
          var texto = link.textContent.trim();
          var match = texto.match(/[\d.,]+/);
          if (match) {
            var valor = parseFloat(match[0].replace('.', '').replace(',', '.'));
            ggpixAbrirModal(Math.round(valor * 100), 'R$ ' + match[0]);
          }
        }
      }, true);
    });
  }

  document.addEventListener('DOMContentLoaded', interceptarLinks);
  new MutationObserver(interceptarLinks).observe(document.body, { childList: true, subtree: true });

})();
