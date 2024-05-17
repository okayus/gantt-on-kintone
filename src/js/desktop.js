(function (PLUGIN_ID) {
  'use strict';

  kintone.events.on('app.record.index.show', async (event) => {
    const viewId = 7454774;
    if (event.viewId !== viewId) {
      return;
    }

    const ganttDiagram = generateGanttDiagram(event);
    const content = document.getElementById('ganttchart-plugin');
    content.innerHTML = ganttDiagram;
  });

  const SECTION_FIELD_CODE = '開発対象のアプリ';
  const TASK_FIELD_CODE = 'タスク名';
  const TASK_STATUS_FIELD_CODE = 'gantt_status';
  const TASK_ID_FIELD_CODE = 'タスク名';
  const START_DATE_FIELD_CODE = '開始日';
  const END_DATE_FIELD_CODE = '終了日';

  function generateGanttDiagram(event) {
    const records = event.records;
    const sectionTasks = {};

    // セクション別にタスクを集約
    records.forEach(record => {
      const section = record[SECTION_FIELD_CODE].value;
      const task = record[TASK_FIELD_CODE].value;
      const status = record[TASK_STATUS_FIELD_CODE].value;
      const taskId = record[TASK_ID_FIELD_CODE].value;
      const startDate = record[START_DATE_FIELD_CODE].value;
      const endDate = record[END_DATE_FIELD_CODE].value;

      if (!sectionTasks[section]) {
        sectionTasks[section] = [];
      }

      sectionTasks[section].push({
        task,
        status,
        taskId,
        startDate,
        endDate
      });
    });

    // mermaid記法に変換
    let mermaidDiagram = 'gantt\n  dateFormat YYYY-MM-DD\n  title Gantt Chart\n';

    Object.keys(sectionTasks).forEach(section => {
      mermaidDiagram += `section ${section}\n`;

      sectionTasks[section].forEach(task => {
        const { task: taskName, status, taskId, startDate, endDate } = task;
        const taskStatus = status ? `${status},` : '';
        mermaidDiagram += `${taskName} :${taskStatus} ${taskId}, ${startDate}, ${endDate}\n`;
      });
    });

    return mermaidDiagram;
  }

})(kintone.$PLUGIN_ID);
