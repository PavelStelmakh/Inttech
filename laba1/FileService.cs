using System;
using CsvHelper;
using Newtonsoft.Json;
using GemBox.Spreadsheet;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.IO;

namespace laba1
{
    static class FileService
    {
        static public T[] ReadCSV<T>(string file)
        {
            T[] data = null;
            using (StreamReader streamReader = new StreamReader(file + ".csv"))
            using (CsvReader csvReader = new CsvReader(streamReader))
            {
                csvReader.Configuration.Delimiter = ",";
                data = csvReader.GetRecords<T>().ToArray();
            }
            return data;
        }

        static public void SaveJson<T>(string file, T data)
        {
            JsonSerializer serializer = new JsonSerializer();
            using (StreamWriter sw = new StreamWriter(file + ".json"))
            using (JsonWriter writer = new JsonTextWriter(sw))
            {
                serializer.Serialize(writer, data);
            }
        }

        static public void SaveExcelStudents(string file, IEnumerable<AvgScoreStudents> avgScoreStudents, IEnumerable<AvgScoreSubject> avgScoreSubject)
        {
            SpreadsheetInfo.SetLicense("FREE-LIMITED-KEY");
            var workbook = new ExcelFile();
            var worksheet = workbook.Worksheets.Add(file);
            int index = 0;
            for (int i = 0; i < avgScoreStudents.Count(); i++, index++)
            {
                AvgScoreStudents students = avgScoreStudents.ElementAt(i);
                worksheet.Cells[index, 0].Value = students.student;
                worksheet.Cells[index, 1].Value = students.avgScore;
            }
            index++;
            for (int i = 0; i < avgScoreStudents.Count(); i++, index++)
            {
                AvgScoreSubject subject = avgScoreSubject.ElementAt(i);
                worksheet.Cells[index, 0].Value = subject.subject;
                worksheet.Cells[index, 1].Value = subject.avgScore;
            }
            workbook.Save(file + ".xlsx");
        }
    }
}
