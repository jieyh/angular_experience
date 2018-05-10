import {Component, OnInit, ViewChild} from '@angular/core';
import {Hero} from '../providers/entities/hero';
import {HeroService} from '../providers/services/hero.service';
import {MockService} from '../providers/services/mock.service';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;



  dtTrigger: Subject<any> = new Subject();
  dtOptions: {} = {};
  pageSize = 5;
  heroes: Hero[] = [];
  constructor(private heroService: HeroService,
              private mockService: MockService) {
  }
  ngOnInit() {
    const dataSet = this.mockService.getData();
    const $this = this;
    this.dtOptions = {
      data: dataSet,
      columnDefs: [ {
        orderable: false,
        className: 'select-checkbox',
        targets:   0
      } ],
      select: {
        style:    'os',
        selector: 'td:first-child'
      },
      'deferRender': true,
      order: [[ 1, 'asc' ]],
      columns: [
        {
          title: 'selected',
          data: function (row, type, set) {
            console.log(set);
            return '';
          }
        },
        { title: 'Position' },
        { title: 'Office' },
        { title: 'Extn.' },
        { title: 'Start date' },
        { title: 'Salary' }
      ],
      pagingType: 'full_numbers',
      pageLength: this.pageSize,
      dom: '<"toolbar">Bfrtip',
      buttons: [
        'selectAll',
        'selectNone',
        'copyHtml5', 'excelHtml5', 'pdfHtml5', 'csvHtml5' ,
        {
          text: 'Some button',
          key: '1',
          action: function (e, dt, node, config) {
            alert('Button activated');
            $this.changePageLength();
          }
        }
      ]
    };
    this.getHeroes();
  }
  changePageLength(): void {
    this.pageSize = 10;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.pageSize).draw();
    });
  }
  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => {
        this.heroes = heroes.slice(1, 5);
        this.dtTrigger.next();
      });
  }

}
