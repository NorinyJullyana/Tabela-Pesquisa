import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from './app.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'bairesdev';
  termoBusca: string = '';
  dados: any[] = [];

  dataSource = new MatTableDataSource<any>();
  colunas: string[] = ['name', 'username', 'email', 'address', 'phone', 'website', 'company'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.dadosDaAPI().subscribe(
      (dadosDaApi) => {
        this.dataSource.data = dadosDaApi;
      },
      (error) => {
        console.error('Erro ao obter dados da API:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.filterPredicate = this.criarFiltro();
  }

  criarFiltro(): (data: any, filter: string) => boolean {
    const filtro = (data: any, filter: string): boolean => {
      const termo = filter.trim().toLowerCase();
      return Object.values(data).some(value => value && value.toString().toLowerCase().includes(termo));
    };
    return filtro;
  }

  filtrarDados(): void {
    this.dataSource.filter = this.termoBusca;
  }

  aoClickEndereco(usuarioId: number, dados: any[]) {
    const dado = this.dataSource.data.find(u => u.id === usuarioId);

    if (dado) {
      const endereco = dado.address;

      if (endereco) {
        const geo = endereco.geo;
        if (geo) {
          alert(`Detalhes do Endereço:\nRua: ${endereco.street}\nCidade: ${endereco.city}\nCEP: ${endereco.zipcode}\nLatitude: ${geo.lat}\nLongitude: ${geo.lng}`);
        } else {
          alert('Não há informações de geolocalização disponíveis.');
        }
      }
    } else {
      alert('O array de dados está vazio.');
    }
  }

  aoClickEmpresa(usuarioId: number, dados: any[]) {
    const dado = this.dataSource.data.find(u => u.id === usuarioId);

    if (dado) {
      const empresa = dado.company;

      if (empresa) {
        alert(`Detalhes da Empresa:\nNome: ${empresa.name}\nLema: ${empresa.catchPhrase}\nSegmento: ${empresa.bs}`);
      } else {
        alert('Não há informações da Empresa disponíveis.');
      }
    } else {
      alert('O array de dados está vazio.');
    }
  }
}
